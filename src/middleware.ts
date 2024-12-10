import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })
  const path = request.nextUrl.pathname

  // 보호된 라우트 목록
  const protectedRoutes = ['/profile', '/write']

  // 인증이 필요한 페이지에 접근하려고 할 때
  if (protectedRoutes.includes(path) && !token) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 이미 로그인한 사용자가 로그인/회원가입 페이지에 접근하려고 할 때
  if ((path === '/login' || path === '/signup') && token) {
    const homeUrl = new URL('/', request.url)
    return NextResponse.redirect(homeUrl)
  }

  return NextResponse.next()
}

// 미들웨어를 적용할 경로 설정
export const config = {
  matcher: ['/profile', '/write', '/login', '/signup'],
}
