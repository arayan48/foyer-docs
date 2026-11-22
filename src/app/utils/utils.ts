import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Schemes } from "@once-ui-system/core";
import type { Locale } from "@/i18n";

interface Post {
  slug: string;
  content: string;
  navTag?: string;
  navLabel?: string;
  navIcon?: string;
  navTagVariant?: Schemes;
  metadata: {
    title: string;
    summary?: string;
    github?: string;
    updatedAt: string;
    image?: string;
    order?: number; // Champ d'ordre pour le tri explicite
  };
}

export function getPages(lang: Locale, customPath: string[] = []): Post[] {
  const contentBasePath = path.join(process.cwd(), "src", "content", lang);
  const postsDir = path.join(contentBasePath, ...customPath);
  
  // Vérifier si le répertoire existe avant d'essayer de le lire
  if (!fs.existsSync(postsDir)) {
    console.warn(`Le répertoire n'existe pas : ${postsDir}`);
    return [];
  }
  
  const files = fs.readdirSync(postsDir);
  const posts: Post[] = [];
  
  // Essayer de lire meta.json s'il existe dans le répertoire courant
  let metaData: { pages?: Record<string, number>, order?: number, title?: string } = {};
  const metaPath = path.join(postsDir, "meta.json");
  if (fs.existsSync(metaPath)) {
    try {
      metaData = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    } catch (error) {
      console.warn(`Erreur lors de la lecture de meta.json : ${metaPath}`, error);
    }
  }

  files.forEach((file) => {
    const filePath = path.join(postsDir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      try {
        posts.push(...getPages(lang, [...customPath, file]));
      } catch (error) {
        console.warn(`Erreur lors de la lecture du répertoire : ${filePath}`, error);
      }
    } else if (file.endsWith('.mdx')) {
      try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        // Créer le slug sans le préfixe src/content
        const slug = path.relative(contentBasePath, filePath)
          .replace(/\.mdx?$/, '')
          .replace(/\\/g, '/');

        // Récupérer l'ordre depuis meta.json si disponible
        const fileName = path.basename(file, path.extname(file));
        const metaOrder = metaData.pages?.[fileName];

        posts.push({
          slug,
          content,
          navTag: data.tag,
          navLabel: data.tagLabel,
          navIcon: data.navIcon,
          navTagVariant: data.navTagVariant,
          metadata: {
            title: data.title || '',
            summary: data.summary,
            github: data.github,
            updatedAt: data.updatedAt || '',
            image: data.image,
            // Priorité : 1. Ordre du frontmatter, 2. Ordre de meta.json, 3. indéfini
            order: data.order !== undefined ? Number(data.order) : (metaOrder !== undefined ? Number(metaOrder) : undefined),
          },
        });
      } catch (error) {
        console.warn(`Erreur lors de la lecture du fichier : ${filePath}`, error);
      }
    }
  });

  return posts;
}

// Types de tri pour les pages de documentation
export type SortType = 'order' | 'alphabetical' | 'date' | 'section';

// Fonction pour trier les pages de manière cohérente dans toute l'application
export function sortPages(pages: Post[], sortType: SortType = 'order'): Post[] {
  if (!pages || pages.length === 0) {
    return [];
  }

  // Créer une copie pour éviter de muter le tableau d'origine
  const sortedPages = [...pages];

  switch (sortType) {
    case 'order':
      // Trier d'abord par ordre explicite (si disponible), puis alphabétiquement par slug en secours
      return sortedPages.sort((a, b) => {
        // Si les deux ont un ordre, trier par ordre
        if (a.metadata.order !== undefined && b.metadata.order !== undefined) {
          return a.metadata.order - b.metadata.order;
        }
        // Si seul a a un ordre, a vient en premier
        if (a.metadata.order !== undefined) {
          return -1;
        }
        // Si seul b a un ordre, b vient en premier
        if (b.metadata.order !== undefined) {
          return 1;
        }
        // Si aucun n'a d'ordre, trier alphabétiquement par slug
        return a.slug.localeCompare(b.slug);
      });

    case 'alphabetical':
      // Trier alphabétiquement par titre
      return sortedPages.sort((a, b) =>
        a.metadata.title.localeCompare(b.metadata.title)
      );

    case 'date':
      // Trier par date de mise à jour (le plus récent en premier)
      return sortedPages.sort((a, b) =>
        new Date(b.metadata.updatedAt).getTime() - new Date(a.metadata.updatedAt).getTime()
      );

    case 'section':
      // Trier par section (structure de répertoire) d'abord, puis par ordre dans la section
      return sortedPages.sort((a, b) => {
        // Obtenir la section (première partie du slug)
        const aSection = a.slug.split('/')[0];
        const bSection = b.slug.split('/')[0];

        // Si les sections sont différentes, trier par section
        if (aSection !== bSection) {
          return aSection.localeCompare(bSection);
        }

        // Si dans la même section, utiliser la logique d'ordre
        if (a.metadata.order !== undefined && b.metadata.order !== undefined) {
          return a.metadata.order - b.metadata.order;
        }
        if (a.metadata.order !== undefined) return -1;
        if (b.metadata.order !== undefined) return 1;

        // Repli alphabétique par titre
        return a.metadata.title.localeCompare(b.metadata.title);
      });

    default:
      return sortedPages;
  }
}

// Fonction pour obtenir les pages adjacentes en fonction du slug courant
export function getAdjacentPages(lang: Locale, currentSlug: string, sortType: SortType = 'section') {
  try {
    // Récupérer toutes les pages
    const allPages = getPages(lang);

    // D'abord, créer un tableau aplati représentant l'ordre exact de la barre latérale
    const sidebarOrderedPages: Post[] = [];

    // Lire le meta.json racine pour l'ordre des sections
    let rootMetaData: { pages?: Record<string, number> } = {};
    const rootMetaPath = path.join(process.cwd(), "src", "content", lang, "meta.json");
    if (fs.existsSync(rootMetaPath)) {
      try {
        rootMetaData = JSON.parse(fs.readFileSync(rootMetaPath, 'utf8'));
      } catch (error) {
        console.warn(`Erreur lors de la lecture du meta.json racine : ${rootMetaPath}`, error);
      }
    }

    // Traiter d'abord les pages de niveau supérieur (pages sans section)
    const topLevelPages = allPages.filter(page => !page.slug.includes('/'));

    // Trier les pages de niveau supérieur selon l'ordre du meta.json
    const sortedTopLevelPages = topLevelPages.sort((a, b) => {
      const aOrder = rootMetaData.pages?.[a.slug];
      const bOrder = rootMetaData.pages?.[b.slug];

      if (aOrder !== undefined && bOrder !== undefined) {
        return aOrder - bOrder;
      }
      if (aOrder !== undefined) return -1;
      if (bOrder !== undefined) return 1;

      // Repli alphabétique par titre
      return a.metadata.title.localeCompare(b.metadata.title);
    });

    // Ajouter les pages de niveau supérieur à la liste ordonnée
    sortedTopLevelPages.forEach(page => {
      sidebarOrderedPages.push(page);
    });

    // Grouper les pages par leur section principale (première partie du chemin)
    const sectionMap = new Map<string, Post[]>();

    allPages.forEach(page => {
      if (page.slug.includes('/')) {
        const section = page.slug.split('/')[0];
        if (!sectionMap.has(section)) {
          sectionMap.set(section, []);
        }
        sectionMap.get(section)!.push(page);
      }
    });

    // Obtenir les sections et les trier selon le meta.json si disponible
    const sections = Array.from(sectionMap.entries()).map(([section, pages]) => ({ section, pages }));

    const sortedSections = [...sections].sort((a, b) => {
      const aOrder = rootMetaData.pages?.[a.section];
      const bOrder = rootMetaData.pages?.[b.section];

      if (aOrder !== undefined && bOrder !== undefined) {
        return aOrder - bOrder;
      }
      if (aOrder !== undefined) return -1;
      if (bOrder !== undefined) return 1;

      // Repli alphabétique
      return a.section.localeCompare(b.section);
    });

    // Traiter chaque section et ajouter ses pages à la liste ordonnée
    sortedSections.forEach(({ section, pages }) => {
      // Essayer de lire le meta.json de la section pour l'ordre des pages dans la section
      let sectionMetaData: { pages?: Record<string, number>, order?: number, folders?: Record<string, number> } = {};
      const sectionMetaPath = path.join(process.cwd(), "src", "content", lang, section, "meta.json");

      if (fs.existsSync(sectionMetaPath)) {
        try {
          sectionMetaData = JSON.parse(fs.readFileSync(sectionMetaPath, 'utf8'));
        } catch (error) {
          console.warn(`Erreur lors de la lecture du meta.json de section : ${sectionMetaPath}`, error);
        }
      }

      // Grouper les pages par sous-dossier dans la section
      const folderMap = new Map<string, Post[]>();

      // D'abord, identifier tous les enfants directs de la section (sans slash supplémentaire)
      const directChildren = pages.filter(page => {
        const pathParts = page.slug.split('/');
        return pathParts.length === 2; // format section/page.mdx
      });

      // Ajouter les enfants directs à la map sous une clé vide
      if (directChildren.length > 0) {
        folderMap.set('', directChildren);
      }

      // Puis grouper les pages imbriquées par leur sous-dossier immédiat
      pages.forEach(page => {
        const pathParts = page.slug.split('/');
        if (pathParts.length > 2) { // C'est dans un sous-dossier
          const folder = pathParts[1]; // Obtenir le nom du sous-dossier
          if (!folderMap.has(folder)) {
            folderMap.set(folder, []);
          }
          folderMap.get(folder)!.push(page);
        }
      });

      // Trier les dossiers selon le meta.json si disponible
      const folders = Array.from(folderMap.entries()).map(([folder, folderPages]) => ({ folder, pages: folderPages }));

      const sortedFolders = [...folders].sort((a, b) => {
        // Le dossier vide (enfants directs) vient toujours en premier
        if (a.folder === '') return -1;
        if (b.folder === '') return 1;

        // Vérifier si les dossiers ont un ordre dans le meta.json de la section
        const aOrder = sectionMetaData.folders?.[a.folder];
        const bOrder = sectionMetaData.folders?.[b.folder];

        if (aOrder !== undefined && bOrder !== undefined) {
          return aOrder - bOrder;
        }
        if (aOrder !== undefined) return -1;
        if (bOrder !== undefined) return 1;

        // Repli alphabétique par nom de dossier
        return a.folder.localeCompare(b.folder);
      });

      // Traiter chaque dossier et ajouter ses pages à la liste ordonnée
      sortedFolders.forEach(({ folder, pages: folderPages }) => {
        // Trier les pages dans le dossier
        const sortedFolderPages = [...folderPages].sort((a, b) => {
          // Extraire le nom de la page depuis le slug (dernière partie après le slash)
          const aName = a.slug.split('/').pop()!;
          const bName = b.slug.split('/').pop()!;

          // Pour les enfants directs, vérifier si les pages ont un ordre dans le meta.json de la section
          if (folder === '') {
            const aOrder = sectionMetaData.pages?.[aName];
            const bOrder = sectionMetaData.pages?.[bName];

            if (aOrder !== undefined && bOrder !== undefined) {
              return aOrder - bOrder;
            }
            if (aOrder !== undefined) return -1;
            if (bOrder !== undefined) return 1;
          }

          // Essayer de lire le meta.json du dossier pour les pages imbriquées
          if (folder !== '') {
            let folderMetaData: { pages?: Record<string, number> } = {};
            const folderMetaPath = path.join(process.cwd(), "src", "content", lang, section, folder, "meta.json");

            if (fs.existsSync(folderMetaPath)) {
              try {
                folderMetaData = JSON.parse(fs.readFileSync(folderMetaPath, 'utf8'));

                const aOrder = folderMetaData.pages?.[aName];
                const bOrder = folderMetaData.pages?.[bName];

                if (aOrder !== undefined && bOrder !== undefined) {
                  return aOrder - bOrder;
                }
                if (aOrder !== undefined) return -1;
                if (bOrder !== undefined) return 1;
              } catch (error) {
                console.warn(`Erreur lors de la lecture du meta.json du dossier : ${folderMetaPath}`, error);
              }
            }
          }

          // Si pas d'ordre explicite, vérifier si les pages ont un ordre dans leur frontmatter
          if (a.metadata.order !== undefined && b.metadata.order !== undefined) {
            return a.metadata.order - b.metadata.order;
          }
          if (a.metadata.order !== undefined) return -1;
          if (b.metadata.order !== undefined) return 1;

          // Repli alphabétique par titre
          return a.metadata.title.localeCompare(b.metadata.title);
        });

        // Ajouter les pages du dossier triées à la liste ordonnée
        sortedFolderPages.forEach(page => {
          sidebarOrderedPages.push(page);
        });
      });
    });

    // Trouver l'index de la page courante dans l'ordre aplati de la barre latérale
    const currentIndex = sidebarOrderedPages.findIndex(page => page.slug === currentSlug);

    if (currentIndex === -1) {
      return { prevPage: null, nextPage: null };
    }

    // Obtenir les pages précédente et suivante selon l'ordre de la barre latérale
    let prevPage = currentIndex > 0 ? sidebarOrderedPages[currentIndex - 1] : null;
    let nextPage = currentIndex < sidebarOrderedPages.length - 1 ? sidebarOrderedPages[currentIndex + 1] : null;

    // Vérifier si la page courante est dans une section ou un dossier imbriqué
    if (currentSlug.includes('/')) {
      const currentParts = currentSlug.split('/');
      const currentSection = currentParts[0];

      // Gérer la navigation vers la page précédente
      if (prevPage) {
        if (!prevPage.slug.includes('/')) {
          // Si la page précédente est une page de niveau supérieur, la mettre à null
          prevPage = null;
        } else {
          const prevParts = prevPage.slug.split('/');
          const prevSection = prevParts[0];

          // Si la page précédente est d'une section différente, la mettre à null
          if (prevSection !== currentSection) {
            prevPage = null;
          } else if (currentParts.length > 2 && prevParts.length > 2) {
            // Si les deux sont dans des dossiers imbriqués, vérifier s'ils sont dans le même dossier
            if (currentParts[1] !== prevParts[1]) {
              // S'ils sont dans des dossiers différents au sein de la même section, mettre prevPage à null
              prevPage = null;
            }
          } else if (currentParts.length > 2 && prevParts.length === 2) {
            // Si la page courante est dans un dossier imbriqué mais la précédente est enfant direct de la section
            prevPage = null;
          }
        }
      }

      // Gérer la navigation vers la page suivante
      if (nextPage) {
        if (!nextPage.slug.includes('/')) {
          // Si la page suivante est une page de niveau supérieur (cas rare), la mettre à null
          nextPage = null;
        } else {
          const nextParts = nextPage.slug.split('/');
          const nextSection = nextParts[0];

          // Si la page suivante est d'une section différente, la mettre à null
          if (nextSection !== currentSection) {
            nextPage = null;
          } else if (currentParts.length > 2 && nextParts.length > 2) {
            // Si les deux sont dans des dossiers imbriqués, vérifier s'ils sont dans le même dossier
            if (currentParts[1] !== nextParts[1]) {
              // S'ils sont dans des dossiers différents au sein de la même section, mettre nextPage à null
              nextPage = null;
            }
          } else if (currentParts.length === 2 && nextParts.length > 2) {
            // Si la page courante est enfant direct de la section mais la suivante est dans un dossier imbriqué
            nextPage = null;
          }
        }
      }
    }

    return { prevPage, nextPage };
  } catch (error) {
    console.error("Erreur lors de la récupération des pages adjacentes :", error);
    return { prevPage: null, nextPage: null };
  }
}

/** Titre traduit d'une section, lu dans son meta.json. */
export function sectionTitle(lang: Locale, section: string): string {
  const file = path.join(process.cwd(), "src", "content", lang, section, "meta.json");
  return (fs.existsSync(file) && JSON.parse(fs.readFileSync(file, "utf8")).title) || section;
}
