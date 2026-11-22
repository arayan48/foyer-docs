import { type NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale } from "./i18n";

// Les adresses sans préfixe servent la langue par défaut.
export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  if (isLocale(url.pathname.split("/")[1])) return NextResponse.next();
  url.pathname = `/${defaultLocale}${url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = { matcher: ["/((?!api/|_next/|.*\\.).*)"] };
