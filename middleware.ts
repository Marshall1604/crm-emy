import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Database, UserRole, UserStatus } from '@/lib/supabase/types';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Static assets & public endpoints
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Public route definitions
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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

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

  // Verify auth session
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  } catch (err) {
    user = null;
  }

  // A. Unauthenticated user accessing private route
  if (!user) {
    if (!isPublicRoute) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  // B. Logged-in user accessing login/register -> redirect to dashboard
  if (isAuthOnlyRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // C. For authenticated user accessing admin routes
  if (pathname.startsWith('/admin')) {
    try {
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role_id')
        .eq('user_id', user.id);

      const roles: UserRole[] = (userRoles || []).map((r: { role_id: UserRole }) => r.role_id);
      const isAdmin = roles.includes('super_admin') || roles.includes('admin');
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    } catch {
      // If error checking role, allow client-side guard to handle
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
