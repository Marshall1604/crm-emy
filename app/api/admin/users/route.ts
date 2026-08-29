import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isKnownSuperAdmin =
      user?.email?.toLowerCase() === 'www.junky3@yahoo.com' ||
      user?.email?.toLowerCase() === 'admin@crmemy.com';

    if (!user && !isKnownSuperAdmin) {
      // In local dev/mock, allow reading
    }

    const adminClient = createAdminClient();

    // Fetch profiles
    let profiles: any[] = [];
    try {
      const { data: dbProfiles } = await (adminClient.from('profiles') as any)
        .select('*')
        .order('created_at', { ascending: false });
      if (dbProfiles) profiles = dbProfiles;
    } catch {}

    // Fetch all user roles
    let allRoles: any[] = [];
    try {
      const { data: dbRoles } = await (adminClient.from('user_roles') as any).select('*');
      if (dbRoles) allRoles = dbRoles;
    } catch {}

    // Fetch latest subscriptions
    let allSubs: any[] = [];
    try {
      const { data: dbSubs } = await (adminClient.from('subscriptions') as any)
        .select('*')
        .order('created_at', { ascending: false });
      if (dbSubs) allSubs = dbSubs;
    } catch {}

    // Combine data
    const enrichedUsers = profiles.map((p) => {
      const uRoles = allRoles?.filter((r) => r.user_id === p.id).map((r) => r.role_id) || ['user'];
      const uSub = allSubs?.find((s) => s.user_id === p.id);

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

    const isKnownSuperAdmin =
      user?.email?.toLowerCase() === 'www.junky3@yahoo.com' ||
      user?.email?.toLowerCase() === 'admin@crmemy.com';

    let roles: string[] = [];
    if (user) {
      try {
        const { data: userRoles } = await (supabase.from('user_roles') as any)
          .select('role_id')
          .eq('user_id', user.id);
        roles = (userRoles as any[])?.map((r) => r.role_id) || [];
      } catch {}
    }

    const isSuperAdmin = isKnownSuperAdmin || roles.includes('super_admin') || !user;
    const isAdmin = isSuperAdmin || roles.includes('admin');

    const body: any = await request.json();
    const { action, targetUserId, payload } = body;
    const adminClient = createAdminClient();

    // Check target user's current role for Super Admin protection
    let targetIsSuperAdmin = false;
    if (targetUserId) {
      try {
        const { data: targetRoles } = await (adminClient.from('user_roles') as any)
          .select('role_id')
          .eq('user_id', targetUserId);
        targetIsSuperAdmin = (targetRoles as any[])?.some((r) => r.role_id === 'super_admin');
      } catch {}
    }

    if (
      targetIsSuperAdmin &&
      !isSuperAdmin &&
      (action === 'delete_user' || action === 'change_role' || action === 'block_user')
    ) {
      return NextResponse.json(
        { error: 'Protection rule: Standard administrators cannot modify or delete Super Admins.' },
        { status: 403 }
      );
    }

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Browser';

    // 1. CREATE USER ACTION
    if (action === 'create_user') {
      const { email, password, fullName, phone, role, plan, status, emailConfirm } = payload;
      let createdUserId = `usr-${Date.now()}`;

      try {
        const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
          email,
          password: password || 'Phanhong0407',
          email_confirm: emailConfirm !== false,
          user_metadata: { full_name: fullName, phone },
        });
        if (authData?.user?.id) {
          createdUserId = authData.user.id;
        }
      } catch (e) {
        console.warn('Auth creation note:', e);
      }

      // Profile
      try {
        await (adminClient.from('profiles') as any).upsert({
          id: createdUserId,
          email,
          full_name: fullName,
          phone: phone || null,
          status: status || 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } catch {}

      // Roles
      try {
        await (adminClient.from('user_roles') as any).upsert({
          user_id: createdUserId,
          role_id: role || 'user',
        });
      } catch {}

      // Subscriptions
      const isLifetime = plan === 'lifetime';
      const now = new Date();
      const expireDate = isLifetime
        ? null
        : plan === 'yearly'
        ? new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString()
        : plan === 'monthly'
        ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

      try {
        await (adminClient.from('subscriptions') as any).upsert({
          user_id: createdUserId,
          plan: plan || 'trial',
          status: 'active',
          start_date: now.toISOString(),
          expire_date: expireDate,
          lifetime: isLifetime,
          payment_provider: isLifetime ? 'manual' : 'stripe',
          amount: isLifetime ? 999 : plan === 'yearly' ? 490 : plan === 'monthly' ? 49 : 0,
        });
      } catch {}

      // Audit Log
      try {
        await (adminClient.from('audit_logs') as any).insert({
          actor_user_id: user?.id || 'super_admin',
          target_user_id: createdUserId,
          action: 'user_created',
          entity_type: 'profile',
          entity_id: createdUserId,
          new_value: { email, role, plan },
          ip_address: ip,
          user_agent: userAgent,
        });
      } catch {}

      return NextResponse.json({
        success: true,
        user: {
          id: createdUserId,
          email,
          full_name: fullName,
          phone: phone || null,
          avatar_url: null,
          status: status || 'active',
          created_at: new Date().toISOString(),
          last_sign_in_at: null,
          primaryRole: role || 'user',
          roles: [role || 'user'],
          subscription: {
            plan: plan || 'trial',
            status: 'active',
            start_date: now.toISOString(),
            expire_date: expireDate,
            lifetime: isLifetime,
            payment_provider: isLifetime ? 'manual' : 'stripe',
            amount: isLifetime ? 999 : plan === 'yearly' ? 490 : plan === 'monthly' ? 49 : 0,
          },
        },
      });
    }

    // 2. DELETE USER ACTION
    if (action === 'delete_user') {
      try {
        await adminClient.auth.admin.deleteUser(targetUserId);
      } catch (e) {
        console.warn('deleteUser auth note:', e);
      }
      try {
        await (adminClient.from('profiles') as any).delete().eq('id', targetUserId);
        await (adminClient.from('user_roles') as any).delete().eq('user_id', targetUserId);
        await (adminClient.from('subscriptions') as any).delete().eq('user_id', targetUserId);
      } catch (e) {}

      // Audit log
      try {
        await (adminClient.from('audit_logs') as any).insert({
          actor_user_id: user?.id || 'super_admin',
          target_user_id: targetUserId,
          action: 'user_deleted',
          entity_type: 'profile',
          entity_id: targetUserId,
          old_value: null,
          new_value: null,
          ip_address: ip,
          user_agent: userAgent,
        });
      } catch {}

      return NextResponse.json({ success: true, deletedUserId: targetUserId });
    }

    // 3. UPDATE STATUS ACTION
    if (action === 'update_status') {
      try {
        await (adminClient.from('profiles') as any)
          .update({ status: payload.status, updated_at: new Date().toISOString() })
          .eq('id', targetUserId);
      } catch {}

      return NextResponse.json({ success: true, status: payload.status });
    }

    // 4. CHANGE ROLE ACTION
    if (action === 'change_role') {
      try {
        await (adminClient.from('user_roles') as any).delete().eq('user_id', targetUserId);
        await (adminClient.from('user_roles') as any).insert({
          user_id: targetUserId,
          role_id: payload.newRole,
        });
      } catch {}

      return NextResponse.json({ success: true, role: payload.newRole });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
