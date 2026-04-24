import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const locales = ["en", "fr"];
const defaultLocale = "en";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip if it's an internal Next.js request or a file
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Check if the pathname has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    // Redirect to default locale if none is found
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, request.url)
    );
  }

  // 3. Protect Dashboard Routes
  if (pathname.includes("/dashboard")) {
    const session = await auth();
    if (!session) {
      const lang = pathname.split("/")[1];
      return NextResponse.redirect(new URL(`/${lang}/auth/signin`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next|api|.*\\..*).*)",
  ],
};
