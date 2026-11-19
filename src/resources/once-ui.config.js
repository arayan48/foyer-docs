const baseURL = "https://docs.foyer.cfd";

const routes = {
  "/changelog": false,
  "/roadmap": false,
};

// Importer et définir la police pour chaque variante
import { Figtree, Unbounded, Geist_Mono } from "next/font/google";

const heading = Unbounded({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const body = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const label = Figtree({
  variable: "--font-label",
  subsets: ["latin"],
  display: "swap",
});

const code = Geist_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

const fonts = {
  heading: heading,
  body: body,
  label: label,
  code: code,
};

const style = {
  theme: "dark", // sombre | clair
  neutral: "sand", // sable | gris | ardoise
  brand: "orange", // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
  accent: "orange", // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
  solid: "color", // couleur | contraste
  solidStyle: "flat", // plat | plastique
  border: "playful", // arrondi | ludique | conservateur
  surface: "translucent", // rempli | translucide
  transition: "all", // all | micro | macro
  scaling: "100",
};

const dataStyle = {
  variant: "gradient", // plat | dégradé | contour
  mode: "categorical", // catégoriel | divergent | séquentiel
  height: 24, // hauteur de graphique par défaut
  axis: {
    stroke: "var(--neutral-alpha-weak)",
  },
  tick: {
    fill: "var(--neutral-on-background-weak)",
    fontSize: 11,
    line: false,
  },
};

const layout = {
  // les unités sont définies en REM
  header: {
    width: 200, // largeur maximale du contenu dans l'en-tête
  },
  body: {
    width: 200, // largeur maximale du corps
  },
  sidebar: {
    width: 17, // largeur de la barre latérale
    collapsible: false, // rendu accordéon ou statique
  },
  content: {
    width: 44, // largeur du bloc de contenu principal
  },
  sideNav: {
    width: 17, // largeur de la navigation latérale sur les pages de document
  },
  footer: {
    width: 72, // largeur du contenu dans le pied de page
  },
};

const effects = {
  mask: {
    cursor: false,
    x: 50,
    y: 0,
    radius: 100,
  },
  gradient: {
    display: false,
    x: 50,
    y: 0,
    width: 100,
    height: 100,
    tilt: 0,
    colorStart: "brand-background-strong",
    colorEnd: "static-transparent",
    opacity: 50,
  },
  dots: {
    display: false,
    size: 2,
    color: "brand-on-background-weak",
    opacity: 20,
  },
  lines: {
    display: false,
    color: "neutral-alpha-weak",
    opacity: 100,
  },
  grid: {
    display: false,
    color: "neutral-alpha-weak",
    opacity: 100,
  },
};

const social = [
  // Les liens sont automatiquement affichés.
  // Importer de nouvelles icônes dans /once-ui/icons.ts
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/arayan48/foyer",
  },
  {
    name: "Site",
    icon: "globe",
    link: "https://foyer.cfd",
  },
];

const schema = {
  logo: "/trademarks/icon-light.svg",
  type: "Organization",
  name: "Foyer",
  description: "Documentation de Foyer : installation, configuration et dimensionnement des serveurs de jeu.",
  email: "",
  locale: "fr_FR",
};

const meta = {
  home: {
    title: `Documentation – ${schema.name}`,
    description: schema.description,
    path: "/",
    image:
      "/api/og/generate?title=Foyer&description=Documentation",
  },
  roadmap: {
    title: `Roadmap – ${schema.name}`,
    description: schema.description,
    path: "/roadmap",
    image: "/api/og/generate?title=Roadmap",
  },
  changelog: {
    title: `Changelog – ${schema.name}`,
    description: schema.description,
    path: "/changelog",
    image: "/api/og/generate?title=Changelog",
  },
};

export {
  dataStyle,
  effects,
  style,
  layout,
  baseURL,
  social,
  schema,
  meta,
  routes,
  fonts,
};
