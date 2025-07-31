import { NextResponse, NextRequest } from "next/server";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const user = await getCookie("tkuser", { cookies });
  const token = await getCookie("tktoken", { cookies });

  if (!user || !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: "/teacher/:path*",
};
