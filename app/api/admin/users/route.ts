import { NextResponse, type NextRequest } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if admin
    const { data: userRoles } = await (supabase.from('user_roles') as any)
      .select('role_id')
      .eq('user_id', user.id);

    const roles = (userRoles as any[])?.map((r) => r.role_id) || [];
    if (!roles.includes('super_admin') && !roles.includes('admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const adminClient = createAdminClient();

    // Fetch profiles
    const { data: profiles, error: profileErr } = await (adminClient.from('profiles') as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (profileErr) {
      return NextResponse.json({ error: profileErr.message }, { status: 500 });
    }

    // Fetch all user roles
    const { data: allRoles } = await (adminClient.from('user_roles') as any).select('*');

    // Fetch latest subscriptions
    const { data: allSubs } = await (adminClient.from('subscriptions') as any)
      .select('*')
      .order('created_at', { ascending: false });

    // Combine data
    const enrichedUsers = (profiles as any[]).map((p) => {
      const uRoles = (allRoles as any[])?.filter((r) => r.user_id === p.id).map((r) => r.role_id) || ['user'];
      const uSub = (allSubs as any[])?.find((s) => s.user_id === p.id);

      return {
        ...p,
        roles: uRoles,
        primaryRole: uRoles.includes('super_admin')
          ? 'super_admin'
          : uRoles.includes('admin')
          ? 'admin'
          : uRoles.includes('staff')
          ? 'staff'
          : 'user',
        subscription: uSub || null,
      };
    });

    return NextResponse.json({ users: enrichedUsers });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if admin
    const { data: userRoles } = await (supabase.from('user_roles') as any)
      .select('role_id')
      .eq('user_id', user.id);

    const roles = (userRoles as any[])?.map((r) => r.role_id) || [];
    const isSuperAdmin = roles.includes('super_admin');
    const isAdmin = roles.includes('admin') || isSuperAdmin;

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body: any = await request.json();
    const { action, targetUserId, payload } = body;
    const adminClient = createAdminClient();

    // Check target user's current role for Super Admin protection
    const { data: targetRoles } = await (adminClient.from('user_roles') as any)
      .select('role_id')
      .eq('user_id', targetUserId);

    const targetIsSuperAdmin = (targetRoles as any[])?.some((r) => r.role_id === 'super_admin');

    if (targetIsSuperAdmin && !isSuperAdmin && (action === 'delete_user' || action === 'change_role' || action === 'block_user')) {
      return NextResponse.json(
        { error: 'Protection rule: Standard administrators cannot modify or delete Super Admins.' },
        { status: 403 }
      );
    }

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Browser';

    // Handle Actions
    if (action === 'update_status') {
      // payload: { status: 'active' | 'blocked' | 'suspended' }
      const { data: oldProfile } = await (adminClient.from('profiles') as any)
        .select('*')
        .eq('id', targetUserId)
        .single();

      await (adminClient.from('profiles') as any)
        .update({ status: payload.status, updated_at: new Date().toISOString() })
        .eq('id', targetUserId);

      // Audit log
      await (adminClient.from('audit_logs') as any).insert({
        actor_user_id: user.id,
        target_user_id: targetUserId,
        action: `user_${payload.status}`,
        entity_type: 'profile',
        entity_id: targetUserId,
        old_value: oldProfile,
        new_value: { status: payload.status },
        ip_address: ip,
        user_agent: userAgent,
      });

      return NextResponse.json({ success: true, status: payload.status });
    }

    if (action === 'change_role') {
      // payload: { newRole: 'super_admin' | 'admin' | 'staff' | 'user' }
      if (payload.newRole === 'super_admin' && !isSuperAdmin) {
        return NextResponse.json({ error: 'Only Super Admins can promote someone to Super Admin.' }, { status: 403 });
      }

      await (adminClient.from('user_roles') as any).delete().eq('user_id', targetUserId);
      await (adminClient.from('user_roles') as any).insert({
        user_id: targetUserId,
        role_id: payload.newRole,
      });

      // Audit log
      await (adminClient.from('audit_logs') as any).insert({
        actor_user_id: user.id,
        target_user_id: targetUserId,
        action: 'role_changed',
        entity_type: 'user_roles',
        entity_id: targetUserId,
        old_value: { roles: targetRoles },
        new_value: { role: payload.newRole },
        ip_address: ip,
        user_agent: userAgent,
      });

      return NextResponse.json({ success: true, role: payload.newRole });
    }

    if (action === 'delete_user') {
      // Delete user from auth and cascade
      await adminClient.auth.admin.deleteUser(targetUserId);

      // Audit log
      await (adminClient.from('audit_logs') as any).insert({
        actor_user_id: user.id,
        target_user_id: targetUserId,
        action: 'user_deleted',
        entity_type: 'profile',
        entity_id: targetUserId,
        old_value: null,
        new_value: null,
        ip_address: ip,
        user_agent: userAgent,
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
