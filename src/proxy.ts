import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth.ts";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Exclude static files and api routes from middleware
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const session = await getSession();

  // 1. If not logged in and not on the login page, redirect to login
  if (!session && pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. If logged in and on the login page, redirect to appropriate dashboard
  if (session && pathname === "/") {
    if (session.role === "manager") {
      return NextResponse.redirect(new URL("/projects", request.url));
    } else {
      return NextResponse.redirect(new URL("/employee/projects", request.url));
    }
  }

  // 3. Prevent employee from accessing manager routes
  if (session?.role === "employee") {
    const isEmployeeRoute = pathname.startsWith("/employee");
    if (!isEmployeeRoute) {
      // Redirect unauthorized employee to their projects view
      return NextResponse.redirect(new URL("/employee/projects", request.url));
    }
  }

  // 4. Prevent manager from accessing employee routes
  if (session?.role === "manager") {
    const isEmployeeRoute = pathname.startsWith("/employee");
    if (isEmployeeRoute) {
      // Redirect unauthorized manager to their projects view
      return NextResponse.redirect(new URL("/projects", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
