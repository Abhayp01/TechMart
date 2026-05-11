import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET || "fallback_secret_for_dev_only";
const key = new TextEncoder().encode(secretKey);

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminApiRoute = pathname.startsWith("/api/admin") || (pathname.startsWith("/api/products") && request.method !== "GET");

  if (!token) {
    if (isAdminRoute || isAdminApiRoute) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });

    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isAdminRoute || isAdminApiRoute) {
      if (payload.role !== "ADMIN") {
        if (pathname.startsWith("/api")) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  } catch (err) {
    // Invalid token
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/products/:path*",
  ],
};
