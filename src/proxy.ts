import { type NextRequest, NextResponse } from "next/server";
import { defaultLocale, detectLocale, isLocale, localeCookie, localePath } from "./i18n";

// Sans préfixe : choix mémorisé, sinon langue du navigateur ; le français est servi sur place.
export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  if (isLocale(url.pathname.split("/")[1])) return NextResponse.next();

  const saved = request.cookies.get(localeCookie)?.value;
  const lang = isLocale(saved) ? saved : detectLocale(request.headers.get("accept-language"));
  if (lang !== defaultLocale) {
    url.pathname = localePath(lang, url.pathname);
    const response = NextResponse.redirect(url);
    response.headers.set("Vary", "Accept-Language, Cookie");
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }

  url.pathname = `/${defaultLocale}${url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = { matcher: ["/((?!api/|_next/|.*\\.).*)"] };
