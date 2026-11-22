export const locales = ["fr", "en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export const localeNames: Record<Locale, string> = { fr: "Français", en: "English", es: "Español" };
export const ogLocales: Record<Locale, string> = { fr: "fr_FR", en: "en_US", es: "es_ES" };

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export const localeCookie = "lang";

/** Première langue proposée du navigateur ; sans en-tête (robots) : français, aucune connue : anglais. */
export function detectLocale(header: string | null): Locale {
  const wanted = (header ?? "")
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().toLowerCase().split(";");
      const q = params.map((x) => x.trim()).find((x) => x.startsWith("q="));
      return { lang: tag.split("-")[0], q: q ? Number(q.slice(2)) : 1 };
    })
    .filter((x) => x.lang && x.lang !== "*" && x.q > 0)
    .sort((x, y) => y.q - x.q);
  if (wanted.length === 0) return defaultLocale;
  return wanted.map((x) => x.lang).find(isLocale) ?? "en";
}

/** Retire le préfixe de langue : /en/a → /a, /en → /. */
export function stripLocale(pathname: string): string {
  const [first, ...rest] = pathname.split("/").filter(Boolean);
  return isLocale(first) ? `/${rest.join("/")}` : pathname;
}

export function localeOf(pathname: string): Locale {
  const first = pathname.split("/")[1];
  return isLocale(first) ? first : defaultLocale;
}

/** Adresse d'une page dans une langue ; le français reste sans préfixe. */
export function localePath(lang: Locale, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (lang === defaultLocale) return clean;
  return clean === "/" ? `/${lang}` : `/${lang}${clean}`;
}

/** Liens canonique et hreflang. */
export function alternates(lang: Locale, path: string) {
  return {
    canonical: localePath(lang, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localePath(l, path)])),
      "x-default": localePath(defaultLocale, path),
    },
  };
}

const fr = {
  metaTitle: "Documentation – Foyer",
  metaDescription: "Documentation de Foyer : installation, configuration et dimensionnement des serveurs de jeu.",
  badge: "Minecraft et FiveM, sur Windows et Linux",
  heroTitle: "Documentation de Foyer",
  heroText: "Installez Foyer, configurez votre machine et choisissez la bonne RAM pour vos serveurs de jeu.",
  start: "Commencer",
  guides: "Guides",
  guidesText: "De l'installation au premier joueur connecté",
  gameServers: "Serveurs de jeu",
  home: "Accueil",
  homeKeywords: "accueil, page d'accueil",
  search: "Rechercher dans la doc...",
  language: "Langue",
  site: "Site",
  download: "Télécharger",
  themeSection: "Thème",
  lightMode: "Mode clair",
  darkMode: "Mode sombre",
  themeKeywords: "mode clair, mode sombre, thème, apparence",
  updated: "Dernière mise à jour :",
  onThisPage: "Sur cette page",
  thumbnail: "Miniature de",
  github: "Voir sur GitHub",
  notFoundTitle: "Page introuvable",
  notFoundText: "La page que vous recherchez n'existe pas.",
  errorTitle: "Une erreur s'est produite",
  errorText: "Cette page n'a pas pu s'afficher.",
  retry: "Réessayer",
  footerOnceUi: "Lancez votre documentation avec Once UI",
  products: "Produits",
  resources: "Ressources",
  about: "À propos",
  terms: "Conditions d'utilisation",
  privacy: "Politique de confidentialité",
  license: "Contrat de licence",
  social: "Réseaux sociaux",
  roadmap: "Feuille de route",
};

export type Dictionary = typeof fr;

const en: Dictionary = {
  metaTitle: "Documentation – Foyer",
  metaDescription: "Foyer documentation: installation, configuration and sizing for game servers.",
  badge: "Minecraft and FiveM, on Windows and Linux",
  heroTitle: "Foyer documentation",
  heroText: "Install Foyer, set up your machine and pick the right amount of RAM for your game servers.",
  start: "Get started",
  guides: "Guides",
  guidesText: "From installation to your first connected player",
  gameServers: "Game servers",
  home: "Home",
  homeKeywords: "home, homepage",
  search: "Search the docs...",
  language: "Language",
  site: "Website",
  download: "Download",
  themeSection: "Theme",
  lightMode: "Light mode",
  darkMode: "Dark mode",
  themeKeywords: "light mode, dark mode, theme, appearance",
  updated: "Last updated:",
  onThisPage: "On this page",
  thumbnail: "Thumbnail of",
  github: "View on GitHub",
  notFoundTitle: "Page not found",
  notFoundText: "The page you are looking for does not exist.",
  errorTitle: "Something went wrong",
  errorText: "This page could not be displayed.",
  retry: "Try again",
  footerOnceUi: "Launch your documentation with Once UI",
  products: "Products",
  resources: "Resources",
  about: "About",
  terms: "Terms of use",
  privacy: "Privacy policy",
  license: "License agreement",
  social: "Social",
  roadmap: "Roadmap",
};

const es: Dictionary = {
  metaTitle: "Documentación – Foyer",
  metaDescription: "Documentación de Foyer: instalación, configuración y dimensionamiento de servidores de juego.",
  badge: "Minecraft y FiveM, en Windows y Linux",
  heroTitle: "Documentación de Foyer",
  heroText: "Instale Foyer, configure su máquina y elija la RAM adecuada para sus servidores de juego.",
  start: "Empezar",
  guides: "Guías",
  guidesText: "De la instalación al primer jugador conectado",
  gameServers: "Servidores de juego",
  home: "Inicio",
  homeKeywords: "inicio, página principal",
  search: "Buscar en la documentación...",
  language: "Idioma",
  site: "Sitio",
  download: "Descargar",
  themeSection: "Tema",
  lightMode: "Modo claro",
  darkMode: "Modo oscuro",
  themeKeywords: "modo claro, modo oscuro, tema, apariencia",
  updated: "Última actualización:",
  onThisPage: "En esta página",
  thumbnail: "Miniatura de",
  github: "Ver en GitHub",
  notFoundTitle: "Página no encontrada",
  notFoundText: "La página que busca no existe.",
  errorTitle: "Se ha producido un error",
  errorText: "No se ha podido mostrar esta página.",
  retry: "Reintentar",
  footerOnceUi: "Publique su documentación con Once UI",
  products: "Productos",
  resources: "Recursos",
  about: "Acerca de",
  terms: "Condiciones de uso",
  privacy: "Política de privacidad",
  license: "Contrato de licencia",
  social: "Redes sociales",
  roadmap: "Hoja de ruta",
};

const dictionaries: Record<Locale, Dictionary> = { fr, en, es };

export const t = (lang: Locale): Dictionary => dictionaries[lang];
