import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parse } from 'cookie';
import { jwtVerify } from 'jose'; 

interface MyJwtPayload {
  admin: boolean;
}

export async function middleware(request: NextRequest) {
  const protectedPaths = ['/settings', '/admin'];
  const afteraccess = ['/login'];
  const adminPaths = ['/admin'];

  const cookieHeader = request.headers.get('cookie');
  const cookies = cookieHeader ? parse(cookieHeader) : {};
  const access_token = cookies.token || null;

  const jwtSecret = new TextEncoder().encode(process.env.TOKEN_SECRET as string);
  if (afteraccess.includes(request.nextUrl.pathname) && (access_token )) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (protectedPaths.includes(request.nextUrl.pathname) && (!access_token )) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check is_admin for admin paths
  if (adminPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    if (!access_token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    
    try {
      const { payload } = await jwtVerify(access_token, jwtSecret) as { payload: MyJwtPayload };
      console.log(access_token, payload)
      if (!payload.admin) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/settings', '/admin/:path*','/login'],
};
