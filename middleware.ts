import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isDashboardRoute = req.nextUrl.pathname.startsWith("/dashboard");
  const isRootRoute = req.nextUrl.pathname === "/";

  // 1. Jika belum login & coba buka dashboard, lempar ke landing page
  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 2. Jika sudah login & membuka landing page root, alihkan ke dashboard
  if (isRootRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

// kecualikan static files, api auth, dan halaman public booking
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|book).*)"],
};