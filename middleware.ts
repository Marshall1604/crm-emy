import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Database, UserRole, UserStatus } from '@/lib/supabase/types';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public static assets and API routes that don't need auth guard
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.') // images, fonts, favicon, etc.
  ) {
    return NextResponse.next();
  }

  // 2. Define Public Routes (Accessible without logging in)
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
    pathname.startsWith('/auth/callback');

  const isAuthOnlyRoute =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password';

  const isSubscriptionExpiredRoute = pathname === '/subscription-expired';
  const isUnauthorizedRoute = pathname === '/unauthorized';
  const isAccountBlockedRoute = pathname === '/account-blocked';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // If Supabase is not configured yet (local mock preview), allow navigation
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Check auth user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // A. Unauthenticated user trying to access protected routes
  if (!user) {
    if (!isPublicRoute) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  // B. Authenticated user visiting /login or /register -> redirect to /dashboard
  if (isAuthOnlyRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // C. Fetch Profile & Subscription Status for route enforcement
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('status')
      .eq('id', user.id)
      .maybeSingle();

    const profileStatus = (profile as { status?: UserStatus } | null)?.status;

    // Check if account is blocked or suspended
    if ((profileStatus === 'blocked' || profileStatus === 'suspended') && !isAccountBlockedRoute) {
      return NextResponse.redirect(new URL('/account-blocked', request.url));
    }

    // Check User Roles
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role_id')
      .eq('user_id', user.id);

    const roles: UserRole[] = (userRoles || []).map((r: { role_id: UserRole }) => r.role_id);
    const isSuperAdmin = roles.includes('super_admin');
    const isAdmin = isSuperAdmin || roles.includes('admin');

    // Email verification check
    if (!user.email_confirmed_at && user.app_metadata?.provider === 'email' && !isSuperAdmin && !isPublicRoute) {
      return NextResponse.redirect(new URL(`/verify-email?email=${encodeURIComponent(user.email || '')}`, request.url));
    }

    // Check Admin Route Authorization (/admin/*)
    if (pathname.startsWith('/admin')) {
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    // Check Subscription Expiry on CRM App Routes (exclude /subscription-expired & /unauthorized)
    if (!isSubscriptionExpiredRoute && !isUnauthorizedRoute && !pathname.startsWith('/admin') && !isAdmin) {
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('status, expire_date, lifetime')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (sub) {
        const isExpired =
          !sub.lifetime &&
          (sub.status === 'expired' ||
            sub.status === 'cancelled' ||
            (sub.expire_date && new Date(sub.expire_date) <= new Date()));

        if (isExpired) {
          return NextResponse.redirect(new URL('/subscription-expired', request.url));
        }
      }
    }
  } catch (err) {
    console.error('Middleware authorization check error:', err);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
