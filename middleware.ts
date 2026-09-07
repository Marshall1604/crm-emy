import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Database, UserRole, UserStatus } from '@/lib/supabase/types';

// ─── Auth Cache (cookie-based, 5 min TTL) ────────────────────────────────────
// Caches role + subscription status to avoid DB calls on every navigation.
// Uses btoa/atob (Edge Runtime safe — NO Buffer).

const CACHE_COOKIE = 'crm_auth_cache';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface AuthCache {
  uid: string;
  exp: number;
  status: string | null;
  role: 'super_admin' | 'admin' | 'user';
  sub: 'active' | 'expired' | 'none';
}

function readCache(request: NextRequest, userId: string): AuthCache | null {
  try {
    const raw = request.cookies.get(CACHE_COOKIE)?.value;
    if (!raw) return null;
    const cache: AuthCache = JSON.parse(atob(raw));
    if (cache.uid !== userId || cache.exp < Date.now()) return null;
    return cache;
  } catch {
    return null;
  }
}

function writeCache(response: NextResponse, data: AuthCache): void {
  try {
    response.cookies.set(CACHE_COOKIE, btoa(JSON.stringify(data)), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: CACHE_TTL_MS / 1000,
    });
  } catch {
    // ignore — cache is best-effort
  }
}

function clearCache(response: NextResponse): void {
  response.cookies.delete(CACHE_COOKIE);
}

// ─── Timeout helper ────────────────────────────────────────────────────────────
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  const t = new Promise<null>((res) => setTimeout(() => res(null), ms));
  return Promise.race([promise, t]);
}

// ─── Middleware ────────────────────────────────────────────────────────────────
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Route flags
  const isPublicRoute =
    pathname === '/' ||
    pathname === '/home' ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname === '/verify-email' ||
    pathname === '/account-blocked' ||
    pathname === '/subscription-expired' ||
    pathname === '/unauthorized' ||
    pathname === '/checkout' ||
    pathname.startsWith('/auth/callback');

  const isAuthOnlyRoute =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password';

  const isSubscriptionExpiredRoute = pathname === '/subscription-expired';
  const isUnauthorizedRoute = pathname === '/unauthorized';
  const isAccountBlockedRoute = pathname === '/account-blocked';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request: { headers: request.headers } });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // ── Step 1: Verify auth token (4s timeout) ───────────────────────────────────
  let user: Awaited<ReturnType<typeof supabase.auth.getUser>>['data']['user'] = null;
  try {
    const result = await withTimeout(supabase.auth.getUser(), 4000);
    user = result?.data?.user ?? null;
  } catch {
    user = null;
  }

  // Not logged in
  if (!user) {
    clearCache(response);
    if (!isPublicRoute) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    return response;
  }

  // Logged in + hitting auth pages → go to dashboard
  if (isAuthOnlyRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Public routes don't need role/subscription checks
  if (isPublicRoute) {
    return response;
  }

  // ── Step 2: Role + subscription (read from cookie cache, or fetch from DB) ──
  let cache = readCache(request, user.id);

  if (!cache) {
    // Cache miss — fetch from Supabase (parallel queries, 3s timeout each)
    try {
      const [profileResult, rolesResult] = await Promise.all([
        withTimeout(
          Promise.resolve(
            supabase.from('profiles').select('status').eq('id', user.id).maybeSingle()
          ),
          3000
        ),
        withTimeout(
          Promise.resolve(
            supabase.from('user_roles').select('role_id').eq('user_id', user.id)
          ),
          3000
        ),
      ]);

      const profileStatus =
        (profileResult?.data as { status?: UserStatus } | null)?.status ?? null;

      const roles: UserRole[] = ((rolesResult?.data ?? []) as { role_id: UserRole }[]).map(
        (r) => r.role_id
      );
      const isSuperAdmin = roles.includes('super_admin');
      const isAdmin = isSuperAdmin || roles.includes('admin');
      const roleLabel: AuthCache['role'] = isSuperAdmin
        ? 'super_admin'
        : isAdmin
          ? 'admin'
          : 'user';

      // Subscription — only needed for non-admins
      let subStatus: AuthCache['sub'] = 'none';
      if (!isAdmin) {
        const subResult = await withTimeout(
          Promise.resolve(
            supabase
              .from('subscriptions')
              .select('status, expire_date, lifetime')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle()
          ),
          3000
        );
        const sub = subResult?.data ?? null;
        if (sub) {
          const expired =
            !sub.lifetime &&
            (sub.status === 'expired' ||
              sub.status === 'cancelled' ||
              (sub.expire_date && new Date(sub.expire_date) <= new Date()));
          subStatus = expired ? 'expired' : 'active';
        }
      } else {
        subStatus = 'active';
      }

      cache = {
        uid: user.id,
        exp: Date.now() + CACHE_TTL_MS,
        status: profileStatus as string | null,
        role: roleLabel,
        sub: subStatus,
      };

      writeCache(response, cache);
    } catch (err) {
      console.error('[middleware] DB fetch error:', err);
      // Allow navigation rather than blocking the user on DB errors
      return response;
    }
  }

  // ── Step 3: Enforce guards using cached data ─────────────────────────────────

  // Blocked / suspended account
  if (
    (cache.status === 'blocked' || cache.status === 'suspended') &&
    !isAccountBlockedRoute
  ) {
    clearCache(response);
    return NextResponse.redirect(new URL('/account-blocked', request.url));
  }

  // Email not verified
  if (
    !user.email_confirmed_at &&
    user.app_metadata?.provider === 'email' &&
    cache.role !== 'super_admin'
  ) {
    return NextResponse.redirect(
      new URL(
        `/verify-email?email=${encodeURIComponent(user.email || '')}`,
        request.url
      )
    );
  }

  // Admin routes
  const isAdmin = cache.role === 'super_admin' || cache.role === 'admin';
  if (pathname.startsWith('/admin') && !isAdmin) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Subscription expired
  if (
    !isSubscriptionExpiredRoute &&
    !isUnauthorizedRoute &&
    !pathname.startsWith('/admin') &&
    !isAdmin &&
    cache.sub === 'expired'
  ) {
    clearCache(response);
    return NextResponse.redirect(new URL('/subscription-expired', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
