import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isProtectedRoute = [
    "/dashboard",
    "/orders",
    "/success",
    "/cancel",
  ].some((route) => pathname.startsWith(route));

  // 🔒 Si connecté → rediriger loin des pages login/register
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 🔒 Si pas connecté → bloquer l'accès aux pages protégées
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Autoriser sinon
  return NextResponse.next();
}

// 🧩 Config des routes à matcher
export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard/:path*",
    "/orders/:path*",
    "/success/:path*",
    "/cancel/:path*",
  ],
};
