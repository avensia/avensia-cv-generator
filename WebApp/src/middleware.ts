// middleware.ts at project root
import { decrypt } from '@/lib/database/session';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const protectedRoutes = ['/createcv'];
const publicRoutes = ['/login', '/register'];

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // ✅ Correct way to read cookies in middleware
  const cookie = req.cookies.get('session')?.value ?? null;
  const session = cookie ? await decrypt(cookie).catch(() => null) : null;

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', origin));
  }

  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL('/createcv', origin));
  }

  return NextResponse.next();
}
