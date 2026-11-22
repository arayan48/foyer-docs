"use client";

import { type Locale, localeCookie, localeNames, localePath, locales, stripLocale, t } from "@/i18n";
import { usePathname } from "next/navigation";

export function LanguageSwitcher({ lang }: { lang: Locale }) {
  const path = stripLocale(usePathname());

  const change = (next: string) => {
    document.cookie = `${localeCookie}=${next}; path=/; max-age=31536000; samesite=lax`;
    // la balise html change de langue, il faut un vrai chargement
    window.location.assign(localePath(next as Locale, path) + window.location.search);
  };

  return (
    // autoComplete : sinon Firefox garde l'ancien choix après un retour en arrière
    <select className="lang-select" aria-label={t(lang).language} autoComplete="off" value={lang} onChange={(e) => change(e.target.value)}>
      {locales.map((l) => (
        <option key={l} value={l} lang={l}>
          {localeNames[l]}
        </option>
      ))}
    </select>
  );
}
