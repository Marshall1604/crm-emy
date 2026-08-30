import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, recordAuditLog } from '@/lib/auth/require-admin';
import { z } from 'zod';
import type { UserRole, UserStatus, SubscriptionPlan } from '@/lib/supabase/types';

const CreateUserSchema = z.object({
  action: z.literal('create_user'),
  payload: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    fullName: z.string().min(1),
    phone: z.string().optional().nullable(),
    role: z.enum(['super_admin', 'admin', 'staff', 'user']).default('user'),
    plan: z.enum(['trial', 'monthly', 'yearly', 'lifetime']).default('trial'),
    status: z.enum(['active', 'blocked', 'suspended']).default('active'),
    emailConfirm: z.boolean().optional().default(true),
  }),
});

const DeleteUserSchema = z.object({
  action: z.literal('delete_user'),
  targetUserId: z.string().uuid(),
});

const UpdateStatusSchema = z.object({
  action: z.literal('update_status'),
  targetUserId: z.string().uuid(),
  payload: z.object({
    status: z.enum(['active', 'blocked', 'suspended']),
  }),
});

const ChangeRoleSchema = z.object({
  action: z.literal('change_role'),
  targetUserId: z.string().uuid(),
  payload: z.object({
    newRole: z.enum(['super_admin', 'admin', 'staff', 'user']),
  }),
});

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.success) return auth.response;

  const { adminClient } = auth.data;

  try {
    // 1. Fetch profiles
    const { data: dbProfiles, error: profilesError } = await adminClient
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      return NextResponse.json({ error: 'Failed to fetch user profiles.' }, { status: 500 });
    }

    // 2. Fetch all user roles
    const { data: dbRoles, error: rolesError } = await adminClient
      .from('user_roles')
      .select('*');

    if (rolesError) {
      return NextResponse.json({ error: 'Failed to fetch user roles.' }, { status: 500 });
    }

    // 3. Fetch latest subscriptions
    const { data: dbSubs } = await adminClient
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    const profiles = dbProfiles || [];
    const allRoles = dbRoles || [];
    const allSubs = dbSubs || [];

    // Combine data
    const enrichedUsers = profiles.map((p) => {
      const uRoles = allRoles.filter((r) => r.user_id === p.id).map((r) => r.role_id) || ['user'];
      const uSub = allSubs.find((s) => s.user_id === p.id);

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
  } catch {
    return NextResponse.json({ error: 'Internal server exception while loading users.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.success) return auth.response;

  const { user: actorUser, isSuperAdmin, adminClient } = auth.data;

  try {
    const rawBody = (await request.json()) as { action?: string; targetUserId?: string; payload?: unknown };
    const action = rawBody?.action;

    // Helper: Check if target user is currently a Super Admin
    const isTargetSuperAdmin = async (targetId: string): Promise<boolean> => {
      const { data: targetRoles } = await adminClient
        .from('user_roles')
        .select('role_id')
        .eq('user_id', targetId);
      return (targetRoles || []).some((r) => r.role_id === 'super_admin');
    };

    // ─── 1. CREATE USER ───
    if (action === 'create_user') {
      const parseResult = CreateUserSchema.safeParse(rawBody);
      if (!parseResult.success) {
        return NextResponse.json(
          { error: 'Invalid user creation payload.', details: parseResult.error.flatten() },
          { status: 400 }
        );
      }

      const { email, password, fullName, phone, role, plan, status, emailConfirm } = parseResult.data.payload;

      // Only Super Admin can create another Super Admin
      if (role === 'super_admin' && !isSuperAdmin) {
        return NextResponse.json(
          { error: 'Forbidden: Only Super Administrators can provision the super_admin role.' },
          { status: 403 }
        );
      }

      const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: emailConfirm,
        user_metadata: { full_name: fullName, phone },
      });

      if (authError || !authData?.user) {
        return NextResponse.json(
          { error: authError?.message || 'Failed to create auth user.' },
          { status: 400 }
        );
      }

      const createdUserId = authData.user.id;

      // Upsert profile
      await adminClient.from('profiles').upsert({
        id: createdUserId,
        email,
        full_name: fullName,
        phone: phone || null,
        status: status as UserStatus,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // Upsert role
      await adminClient.from('user_roles').upsert({
        user_id: createdUserId,
        role_id: role as UserRole,
      });

      // Upsert subscription
      const isLifetime = plan === 'lifetime';
      const now = new Date();
      const expireDate = isLifetime
        ? null
        : plan === 'yearly'
        ? new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString()
        : plan === 'monthly'
        ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

      await adminClient.from('subscriptions').upsert({
        user_id: createdUserId,
        plan: plan as SubscriptionPlan,
        status: 'active',
        start_date: now.toISOString(),
        expire_date: expireDate,
        lifetime: isLifetime,
        payment_provider: isLifetime ? 'manual' : 'stripe',
        amount: isLifetime ? 999 : plan === 'yearly' ? 490 : plan === 'monthly' ? 49 : 0,
      });

      // Audit Log
      await recordAuditLog(actorUser.id, 'user_created', 'profile', createdUserId, {
        email,
        role,
        plan,
      });

      return NextResponse.json({
        success: true,
        user: {
          id: createdUserId,
          email,
          full_name: fullName,
          phone: phone || null,
          status,
          primaryRole: role,
          roles: [role],
        },
      });
    }

    // ─── 2. DELETE USER ───
    if (action === 'delete_user') {
      const parseResult = DeleteUserSchema.safeParse(rawBody);
      if (!parseResult.success) {
        return NextResponse.json({ error: 'Invalid user deletion payload.' }, { status: 400 });
      }

      const { targetUserId } = parseResult.data;

      if (targetUserId === actorUser.id) {
        return NextResponse.json({ error: 'Security restriction: Administrators cannot delete their own account.' }, { status: 400 });
      }

      const targetIsSuper = await isTargetSuperAdmin(targetUserId);
      if (targetIsSuper && !isSuperAdmin) {
        return NextResponse.json(
          { error: 'Forbidden: Only Super Administrators can delete another Super Administrator.' },
          { status: 403 }
        );
      }

      await adminClient.auth.admin.deleteUser(targetUserId);
      await adminClient.from('profiles').delete().eq('id', targetUserId);
      await adminClient.from('user_roles').delete().eq('user_id', targetUserId);
      await adminClient.from('subscriptions').delete().eq('user_id', targetUserId);

      await recordAuditLog(actorUser.id, 'user_deleted', 'profile', targetUserId);

      return NextResponse.json({ success: true, deletedUserId: targetUserId });
    }

    // ─── 3. UPDATE STATUS (BLOCK / UNBLOCK / SUSPEND) ───
    if (action === 'update_status') {
      const parseResult = UpdateStatusSchema.safeParse(rawBody);
      if (!parseResult.success) {
        return NextResponse.json({ error: 'Invalid status update payload.' }, { status: 400 });
      }

      const { targetUserId, payload } = parseResult.data;

      if (targetUserId === actorUser.id && payload.status !== 'active') {
        return NextResponse.json({ error: 'Security restriction: You cannot block or suspend your own account.' }, { status: 400 });
      }

      const targetIsSuper = await isTargetSuperAdmin(targetUserId);
      if (targetIsSuper && !isSuperAdmin) {
        return NextResponse.json(
          { error: 'Forbidden: Only Super Administrators can modify the status of another Super Administrator.' },
          { status: 403 }
        );
      }

      await adminClient
        .from('profiles')
        .update({ status: payload.status as UserStatus, updated_at: new Date().toISOString() })
        .eq('id', targetUserId);

      await recordAuditLog(actorUser.id, `user_status_${payload.status}`, 'profile', targetUserId, {
        status: payload.status,
      });

      return NextResponse.json({ success: true, status: payload.status });
    }

    // ─── 4. CHANGE ROLE ───
    if (action === 'change_role') {
      const parseResult = ChangeRoleSchema.safeParse(rawBody);
      if (!parseResult.success) {
        return NextResponse.json({ error: 'Invalid role change payload.' }, { status: 400 });
      }

      const { targetUserId, payload } = parseResult.data;
      const { newRole } = payload;

      const targetIsSuper = await isTargetSuperAdmin(targetUserId);

      // Rule: Granting or revoking super_admin requires the actor to be super_admin
      if ((newRole === 'super_admin' || targetIsSuper) && !isSuperAdmin) {
        return NextResponse.json(
          { error: 'Forbidden: Only Super Administrators can assign or alter Super Administrator roles.' },
          { status: 403 }
        );
      }

      await adminClient.from('user_roles').delete().eq('user_id', targetUserId);
      await adminClient.from('user_roles').insert({
        user_id: targetUserId,
        role_id: newRole as UserRole,
      });

      await recordAuditLog(actorUser.id, 'user_role_changed', 'user_roles', targetUserId, {
        newRole,
      });

      return NextResponse.json({ success: true, role: newRole });
    }

    return NextResponse.json({ error: 'Unsupported administrative action.' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Internal server exception while processing request.' }, { status: 500 });
  }
}
