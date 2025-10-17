import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value;
  const { pathname } = req.nextUrl;

  let isValid = false;
  console.log("🔵 Middleware session:", { session });
  
  if (session) {
    try {
      await jwtVerify(session, new TextEncoder().encode(process.env.JWT_SECRET!));
      isValid = true;
    } catch (err: any) {
      if (err.code === "ERR_JWS_INVALID") {
        console.warn("⚠️ Invalid JWT token:", err.message);
      } else {
        console.error("🔴 JWT verification error:", err);
      }
    }
  }

  console.log("🔵 Middleware check:", { hasSession: !!session, isValid, pathname });

  // 🔥 CRITICAL: Don't run middleware on API auth routes at all
  // Let them set cookies without interference
  if (pathname.startsWith("/api/auth/") || pathname.startsWith("/api/customize/get-template") || pathname.startsWith("/search/") || pathname.startsWith("/share/")) {
    return NextResponse.next();
  }

  // Public routes
  if (pathname === "/login" || pathname === "/search" || pathname === "/share") {
    if (isValid && pathname === "/login") {
      return NextResponse.redirect(new URL("/admin/url", req.url));
    }
    return NextResponse.next();
  }

  // API protection
  if (!isValid && pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Protect all other pages
  if (!isValid) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname==='/admin'){
    return NextResponse.redirect(new URL("/admin/url", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};