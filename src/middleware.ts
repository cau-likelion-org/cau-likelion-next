import { NextRequest, NextResponse } from 'next/server';

// 서버를 잠시 닫을 때 
// maintenance.ts 파일에 원하는 페이지 문구를 작성하고
// MAINTENANCE_MODE를 true로 바꾸고 배포하면 리다이렉트됩니다! 
const MAINTENANCE_MODE = true;

export function middleware(request: NextRequest) {
  if (!MAINTENANCE_MODE) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === '/maintenance') {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL('/maintenance', request.url));
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|image).*)'],
};
