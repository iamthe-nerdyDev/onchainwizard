import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token as any;

    const isCheckilistCompleted =
      token && token.user.age && token.user.name && token.user.experience;

    if (token && !isCheckilistCompleted) {
      if (pathname === "/checklist") {
        return NextResponse.next();
      }

      const protectedRoutes = ["/chat", "/contacts", "/settings"];
      if (protectedRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL("/checklist", req.url));
      }
    }

    if (token && pathname === "/checklist") {
      return NextResponse.redirect(new URL("/chat", req.url));
    }

    if (token && pathname === "/login") {
      return NextResponse.redirect(new URL("/chat", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        if (pathname.startsWith("/api/auth")) return true;
        if (pathname === "/login" || pathname === "/") {
          return true;
        }

        const isProtectedRoute = [
          "/chat",
          "/checklist",
          "/contacts",
          "/settings",
        ].includes(pathname);

        const isProtectedAPI =
          pathname.startsWith("/api") && !pathname.startsWith("/api/auth");
        if (isProtectedRoute || isProtectedAPI) return !!token;

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
