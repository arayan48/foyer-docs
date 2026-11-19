import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Schemes } from '@once-ui-system/core';

interface NavigationItem {
    slug: string;
    title: string;
    label?: string;
    navTag?: string;
    navLabel?: string;
    navIcon?: string;
    navTagVariant?: Schemes;
    keywords?: string;
    children?: NavigationItem[];
    order?: number;
}

interface MetaData {
    title?: string;
    order?: number;
    pages?: Record<string, number>; 
}

// Fonction de tri partagée pour garantir un tri cohérent à tous les niveaux
function sortItems(items: NavigationItem[]): NavigationItem[] {
  return items.sort((a, b) => {
    // D'abord, séparer les éléments non catégorisés (fichiers) des éléments catégorisés (répertoires)
    const aIsCategory = !!a.children;
    const bIsCategory = !!b.children;

    // Priorité aux pages non catégorisées (fichiers) sur les catégorisées (répertoires)
    if (!aIsCategory && bIsCategory) return -1;
    if (aIsCategory && !bIsCategory) return 1;

    // Si les deux sont du même type (fichiers ou répertoires)
    // Priorité aux éléments ayant une propriété d'ordre
    const aHasOrder = typeof a.order === 'number';
    const bHasOrder = typeof b.order === 'number';

    // Si seulement un élément a un ordre, lui donner la priorité
    if (aHasOrder && !bHasOrder) return -1;
    if (!aHasOrder && bHasOrder) return 1;

    // Si les deux ont un ordre, trier par ordre
    if (aHasOrder && bHasOrder) {
      if (a.order !== b.order) {
        return a.order! - b.order!;
      }
    }

    // Repli alphabétique
    return a.title.localeCompare(b.title);
  });
}

export default function getNavigation(dirPath = path.join(process.cwd(), 'src/content')): NavigationItem[] {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  const dirMetaPath = path.join(dirPath, 'meta.json');
  let dirMeta: MetaData | null = null;
  
  try {
    if (fs.existsSync(dirMetaPath)) {
      const metaContent = fs.readFileSync(dirMetaPath, 'utf8');
      dirMeta = JSON.parse(metaContent);
    }
  } catch (error) {
    console.error(`Erreur lors de la lecture du meta.json dans ${dirPath} :`, error);
  }

  const navigationItems = entries.map((entry) => {
    // Ignorer les fichiers meta.json eux-mêmes pour ne pas les inclure dans la navigation
    if (entry.name === 'meta.json') {
      return null;
    }
    
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      const metaPath = path.join(fullPath, 'meta.json');
      let metaData: MetaData | null = null;
      
      try {
        if (fs.existsSync(metaPath)) {
          const metaContent = fs.readFileSync(metaPath, 'utf8');
          
          try {
            metaData = JSON.parse(metaContent);
          } catch (jsonError) {
            console.error(`Erreur lors du parsing de meta.json dans ${fullPath} :`, jsonError);
          }
        }
      } catch (error) {
        console.error(`Erreur lors de la lecture de meta.json dans ${fullPath} :`, error);
      }
      
      // Obtenir les enfants et les trier avant de retourner
      const children = getNavigation(fullPath);

      const item = {
        slug: entry.name,
        title: metaData?.title || entry.name,
        order: metaData?.order,
        children: children, // Déjà triés par l'appel récursif
      };
      
      return item;
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      
      const filenameNoExt = entry.name.replace(/\.mdx$/, '');
      
      let pageOrder: number | undefined;
      
      if (dirMeta?.pages?.[entry.name] !== undefined) {
        pageOrder = dirMeta.pages[entry.name];
      } 
      else if (dirMeta?.pages?.[filenameNoExt] !== undefined) {
        pageOrder = dirMeta.pages[filenameNoExt];
      }

      const contentDir = path.join(process.cwd(), 'src/content');
      const relativePath = path.relative(contentDir, fullPath);
      const normalizedPath = relativePath.replace(/\\/g, '/').replace(/\.mdx?$/, '');

      const item = {
        slug: normalizedPath,
        title: data.title || entry.name.replace(/\.mdx?$/, ''),
        navTag: data.navTag,
        navLabel: data.navLabel,
        navIcon: data.navIcon,
        navTagVariant: data.navTagVariant,
        keywords: data.keywords,
        order: pageOrder !== undefined ? pageOrder : data.order,
      };
      
      return item;
    }
    
    return null; // Ignorer les fichiers non-répertoires et non-MDX
  }).filter(Boolean) as NavigationItem[];
  
  // Trier les éléments avec la fonction de tri partagée
  const sortedItems = sortItems(navigationItems);
  
  return sortedItems;
}