import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

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

  // 2. Define Public Auth Routes
  const isAuthRoute =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/verify-email' ||
    pathname.startsWith('/auth/callback');

  const isSubscriptionExpiredRoute = pathname === '/subscription-expired';
  const isUnauthorizedRoute = pathname === '/unauthorized';

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

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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
    if (!isAuthRoute && !isSubscriptionExpiredRoute && !isUnauthorizedRoute) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  // B. Authenticated user visiting /login or /register -> redirect to /dashboard
  if (isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // C. Fetch Profile & Subscription Status for route enforcement
  try {
    const { data: profile } = await (supabase.from('profiles') as any)
      .select('status')
      .eq('id', user.id)
      .single();

    // Check if account is blocked or suspended
    if (profile?.status === 'blocked' || profile?.status === 'suspended') {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('error', 'account_blocked');
      // Sign out cookie
      return NextResponse.redirect(redirectUrl);
    }

    // Check Admin Route Authorization (/admin/*)
    if (pathname.startsWith('/admin')) {
      const { data: userRoles } = await (supabase.from('user_roles') as any)
        .select('role_id')
        .eq('user_id', user.id);

      const roles = (userRoles as any[])?.map((r) => r.role_id) || [];
      const isAdmin = roles.includes('super_admin') || roles.includes('admin');

      if (!isAdmin) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    // Check Subscription Expiry on CRM App Routes (exclude /subscription-expired & /unauthorized)
    if (!isSubscriptionExpiredRoute && !isUnauthorizedRoute && !pathname.startsWith('/admin')) {
      const { data: userRoles } = await (supabase.from('user_roles') as any)
        .select('role_id')
        .eq('user_id', user.id);

      const isSuperAdmin = (userRoles as any[])?.some((r) => r.role_id === 'super_admin');

      if (!isSuperAdmin) {
        const { data: sub } = await (supabase.from('subscriptions') as any)
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
