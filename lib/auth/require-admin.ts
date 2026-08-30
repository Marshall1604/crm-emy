import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';

export interface AuthContextResult {
  user: User;
  roles: string[];
  isAdmin: boolean;
  isSuperAdmin: boolean;
  supabase: Awaited<ReturnType<typeof createClient>>;
  adminClient: ReturnType<typeof createAdminClient>;
}

export type AuthRequirementResult =
  | { success: true; data: AuthContextResult }
  | { success: false; response: NextResponse };

/**
 * Authenticates the current user from session cookies and resolves their DB roles.
 * Fail-closed: any query error or missing user returns 401/403.
 */
export async function getAuthenticatedUser(): Promise<
  | { success: true; data: AuthContextResult }
  | { success: false; response: NextResponse }
> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Unauthorized: Authentication required.' },
          { status: 401 }
        ),
      };
    }

    // Query roles strictly from database
    let adminClient: ReturnType<typeof createAdminClient>;
    try {
      adminClient = createAdminClient();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Server admin configuration error';
      return {
        success: false,
        response: NextResponse.json(
          { error: message },
          { status: 500 }
        ),
      };
    }

    const { data: userRoles, error: rolesError } = await adminClient
      .from('user_roles')
      .select('role_id')
      .eq('user_id', user.id);

    if (rolesError) {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Authorization error: Failed to verify roles.' },
          { status: 403 }
        ),
      };
    }

    const roles = (userRoles || []).map((r: { role_id: string }) => r.role_id);
    const isSuperAdmin = roles.includes('super_admin');
    const isAdmin = isSuperAdmin || roles.includes('admin');

    return {
      success: true,
      data: {
        user,
        roles,
        isAdmin,
        isSuperAdmin,
        supabase,
        adminClient,
      },
    };
  } catch {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Internal security exception.' },
        { status: 500 }
      ),
    };
  }
}

/**
 * Requires the user to have either 'admin' or 'super_admin' role.
 */
export async function requireAdmin(): Promise<AuthRequirementResult> {
  const auth = await getAuthenticatedUser();
  if (!auth.success) return auth;

  if (!auth.data.isAdmin) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Forbidden: Administrator privileges required.' },
        { status: 403 }
      ),
    };
  }

  return auth;
}

/**
 * Requires the user to have the 'super_admin' role strictly.
 */
export async function requireSuperAdmin(): Promise<AuthRequirementResult> {
  const auth = await getAuthenticatedUser();
  if (!auth.success) return auth;

  if (!auth.data.isSuperAdmin) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Forbidden: Super Administrator privileges required.' },
        { status: 403 }
      ),
    };
  }

  return auth;
}

/**
 * Records an audit log entry in the database.
 */
export async function recordAuditLog(
  actorUserId: string,
  action: string,
  entityType?: string | null,
  targetUserId?: string | null,
  metadata?: Record<string, unknown>
) {
  try {
    const adminClient = createAdminClient();
    await adminClient.from('audit_logs').insert({
      actor_user_id: actorUserId,
      action,
      entity_type: entityType || null,
      target_user_id: targetUserId || null,
      new_value: (metadata as unknown as import('@/lib/supabase/types').Json) || null,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    // Non-blocking for primary transaction, but logged server-side
    console.error('Failed to write audit log entry:', err);
  }
}
