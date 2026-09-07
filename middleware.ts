import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Database, UserRole, UserStatus } from '@/lib/supabase/types';

// Cache cookie name & TTL (5 minutes)
const CACHE_COOKIE = 'crm_auth_cache';
const CACHE_TTL_MS = 5 * 60 * 1000;

interface AuthCache {
  uid: string;
  exp: number;
  status: string | null;   // profile status
  role: string;            // 'super_admin' | 'admin' | 'user'
  sub: 'active' | 'expired' | 'none'; // subscription status
}

function readCache(request: NextRequest, userId: string): AuthCache | null {
  try {
    const raw = request.cookies.get(CACHE_COOKIE)?.value;
    if (!raw) return null;
    const cache: AuthCache = JSON.parse(Buffer.from(raw, 'base64').toString('utf-8'));
    if (cache.uid !== userId || cache.exp < Date.now()) return null;
    return cache;
  } catch {
    return null;
  }
}

function writeCache(response: NextResponse, data: AuthCache): void {
  try {
    const encoded = Buffer.from(JSON.stringify(data)).toString('base64');
    response.cookies.set(CACHE_COOKIE, encoded, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: CACHE_TTL_MS / 1000,
    });
  } catch {
    // ignore
  }
}

function clearCache(response: NextResponse): void {
  response.cookies.delete(CACHE_COOKIE);
}

// Wrap a promise with a timeout — resolves null on timeout
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), ms));
  return Promise.race([promise, timeout]);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip static assets & known public file extensions
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Route classification
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

  // 3. Auth check — 4s timeout
  let user: Awaited<ReturnType<typeof supabase.auth.getUser>>['data']['user'] = null;
  try {
    const authResult = await withTimeout(supabase.auth.getUser(), 4000);
    user = authResult?.data?.user ?? null;
  } catch {
    user = null;
  }

  // A. Unauthenticated
  if (!user) {
    clearCache(response);
    if (!isPublicRoute) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  // B. Logged-in user hitting auth-only pages → dashboard
  if (isAuthOnlyRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // C. Skip heavy DB checks for public routes
  if (isPublicRoute) {
    return response;
  }

  // D. Try to read from cache first (avoids DB on every navigation)
  let cache = readCache(request, user.id);

  if (!cache) {
    // Cache miss — fetch from DB (with timeouts), then cache result
    try {
      // Profile status
      const profileResult = await withTimeout(
        Promise.resolve(
          supabase.from('profiles').select('status').eq('id', user.id).maybeSingle()
        ),
        3000
      );
      const profileStatus =
        (profileResult?.data as { status?: UserStatus } | null)?.status ?? null;

      // User roles
      const rolesResult = await withTimeout(
        Promise.resolve(
          supabase.from('user_roles').select('role_id').eq('user_id', user.id)
        ),
        3000
      );
      const userRoles = rolesResult?.data ?? [];
      const roles: UserRole[] = (userRoles || []).map(
        (r: { role_id: UserRole }) => r.role_id
      );
      const isSuperAdmin = roles.includes('super_admin');
      const isAdmin = isSuperAdmin || roles.includes('admin');
      const roleLabel = isSuperAdmin ? 'super_admin' : isAdmin ? 'admin' : 'user';

      // Subscription (only for non-admin users)
      let subStatus: 'active' | 'expired' | 'none' = 'none';
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
          const isExpired =
            !sub.lifetime &&
            (sub.status === 'expired' ||
              sub.status === 'cancelled' ||
              (sub.expire_date && new Date(sub.expire_date) <= new Date()));
          subStatus = isExpired ? 'expired' : 'active';
        }
      } else {
        subStatus = 'active'; // admins are always active
      }

      cache = {
        uid: user.id,
        exp: Date.now() + CACHE_TTL_MS,
        status: profileStatus as string | null,
        role: roleLabel,
        sub: subStatus,
      };

      // Write cache to response cookie
      writeCache(response, cache);
    } catch (err) {
      console.error('Middleware DB fetch error:', err);
      // On DB error, allow navigation (don't block the user)
      return response;
    }
  }

  // E. Apply cached checks

  // Account blocked / suspended
  if (
    (cache.status === 'blocked' || cache.status === 'suspended') &&
    !isAccountBlockedRoute
  ) {
    clearCache(response);
    return NextResponse.redirect(new URL('/account-blocked', request.url));
  }

  // Email verification
  const isSuperAdmin = cache.role === 'super_admin';
  if (
    !user.email_confirmed_at &&
    user.app_metadata?.provider === 'email' &&
    !isSuperAdmin
  ) {
    return NextResponse.redirect(
      new URL(`/verify-email?email=${encodeURIComponent(user.email || '')}`, request.url)
    );
  }

  // Admin route guard
  const isAdmin = cache.role === 'super_admin' || cache.role === 'admin';
  if (pathname.startsWith('/admin') && !isAdmin) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Subscription expiry guard
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
