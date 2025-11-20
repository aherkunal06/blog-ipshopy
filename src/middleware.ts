import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = (token as { role?: string })?.role;

  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  
  // Check for admin routes that require authentication
  if (isAdminRoute) {
    // If not authenticated as admin or super-admin, redirect to login
    if (!role || !['admin', 'super-admin'].includes(role)) {
      return NextResponse.redirect(new URL('/auth/admin/login', req.url));
    }
    
    // Super-admin only routes
    const isSuperAdminRoute = req.nextUrl.pathname.includes('/admin/user-management') || 
                             req.nextUrl.pathname.includes('/admin/add-admin');
    
    if (isSuperAdminRoute && role !== 'super-admin') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

