import { getPages } from "@/app/utils/utils";
import { alternates, localePath, locales } from "@/i18n";
import { baseURL } from "@/resources";

const absolute = (path: string) => `${baseURL}${path === "/" ? "" : path}`;

export default function sitemap() {
  return locales.flatMap((lang) => {
    const pages = getPages(lang);
    const entry = (path: string, lastModified?: string) => ({
      url: absolute(localePath(lang, path)),
      lastModified,
      alternates: {
        languages: Object.fromEntries(Object.entries(alternates(lang, path).languages).map(([l, p]) => [l, absolute(p)])),
      },
    });
    const latest = pages.map((p) => p.metadata.updatedAt).sort().at(-1);
    return [entry("/", latest), ...pages.map((p) => entry(`/${p.slug}`, p.metadata.updatedAt))];
  });
}
