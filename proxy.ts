import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export function proxy(request: NextRequest) {
  const authSessionToken =
    request.cookies.get("authjs.session-token") ??
    request.cookies.get("__Secure-authjs.session-token");
  const protectedRoutes = [
    "/dashboard",
    "/alert",
    "/alert_dialog",
    "/toast",
    "/campaigns",
    "/profile",
  ];

  if (
    !authSessionToken &&
    protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/getstarted", request.nextUrl));
  }

  return NextResponse.next();
}
