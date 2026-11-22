"use client";

import { type Locale, localeNames, localePath, locales, stripLocale, t } from "@/i18n";
import { usePathname } from "next/navigation";

export function LanguageSwitcher({ lang }: { lang: Locale }) {
  const path = stripLocale(usePathname());
  return (
    <nav className="lang-switch" aria-label={t(lang).language}>
      {locales.map((l) => (
        // <a> : la balise html change de langue, il faut un vrai chargement
        <a key={l} href={localePath(l, path)} hrefLang={l} lang={l} title={localeNames[l]} aria-label={localeNames[l]} aria-current={l === lang ? "true" : undefined}>
          {l.toUpperCase()}
        </a>
      ))}
    </nav>
  );
}
