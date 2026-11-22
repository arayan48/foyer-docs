"use client";

import { type Locale, localeCookie, localeNames, localePath, locales, stripLocale, t } from "@/i18n";
import { usePathname } from "next/navigation";
import { type KeyboardEvent, useEffect, useRef } from "react";

export function LanguageSwitcher({ lang }: { lang: Locale }) {
  const path = stripLocale(usePathname());
  const menu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const close = (e: Event) => {
      if (menu.current && !menu.current.contains(e.target as Node)) menu.current.open = false;
    };
    document.addEventListener("click", close);
    document.addEventListener("focusin", close);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("focusin", close);
    };
  }, []);

  const onKeyDown = (e: KeyboardEvent) => {
    const el = menu.current;
    if (!el) return;
    if (e.key === "Escape") {
      el.open = false;
      el.querySelector("summary")?.focus();
    }
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    el.open = true;
    const items = [...el.querySelectorAll("a")];
    const i = items.indexOf(document.activeElement as HTMLAnchorElement);
    const step = e.key === "ArrowDown" ? 1 : -1;
    items[i < 0 ? (step > 0 ? 0 : items.length - 1) : (i + step + items.length) % items.length].focus();
  };

  return (
    <details className="lang-menu" ref={menu} onKeyDown={onKeyDown}>
      <summary aria-label={`${t(lang).language} : ${localeNames[lang]}`} title={localeNames[lang]}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
        </svg>
      </summary>
      <ul>
        {locales.map((l) => (
          <li key={l}>
            {/* <a> : la balise html change de langue, il faut un vrai chargement */}
            <a
              href={localePath(l, path)}
              hrefLang={l}
              lang={l}
              aria-current={l === lang ? "true" : undefined}
              onClick={(e) => {
                document.cookie = `${localeCookie}=${l}; path=/; max-age=31536000; samesite=lax`;
                e.currentTarget.search = window.location.search;
                e.currentTarget.hash = window.location.hash;
              }}
            >
              {localeNames[l]}
              {l === lang && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
              )}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
