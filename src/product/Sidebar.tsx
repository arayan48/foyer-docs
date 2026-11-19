"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Schemes, Accordion, Column, Flex, Icon, Row, Tag, ToggleButton } from "@once-ui-system/core";
import { usePathname } from 'next/navigation';
import { routes, layout } from "@/resources";

import styles from './Sidebar.module.scss';

// Cache global de navigation pour éviter les rechargements inutiles
let globalNavigationCache: any = null;

export interface NavigationItem extends Omit<React.ComponentProps<typeof Flex>, "title" | "label" | "children">{
  slug: string;
  title: string;
  label?: string;
  order?: number;
  children?: NavigationItem[];
  schemes?: Schemes;
  keywords?: string;
  navIcon?: string;
  navTag?: string;
  navLabel?: string;
  navTagVariant?: Schemes;
}

interface SidebarProps extends Omit<React.ComponentProps<typeof Flex>, "children"> {
  initialNavigation?: NavigationItem[];
}

// Composant d'élément de navigation mémoïsé pour éviter les re-rendus
const NavigationItemComponent: React.FC<{
  item: NavigationItem;
  depth: number;
  pathname: string;
  renderNavigation: (items: NavigationItem[], depth: number) => React.ReactNode;
}> = ({ item, depth, pathname, renderNavigation }) => {
  const correctedSlug = item.slug;
  
  // Extraire les segments de chemin pour une meilleure correspondance
  const pathSegments = pathname.split('/').filter(Boolean);

  // Pour les répertoires de niveau supérieur, vérifier si leur nom est dans les segments du chemin
  // Cela correspondra aux routes comme "/once-ui/quick-start" pour le parent "once-ui"
  const isTopLevelMatch = depth === 0 &&
                          pathSegments.length >= 2 &&
                          pathSegments[0] === 'docs' &&
                          correctedSlug.split('/')[0] === pathSegments[1];

  // Pour les éléments plus profonds, vérifier la correspondance exacte ou si c'est un chemin parent
  const isExactMatch = pathname === `/${correctedSlug}`;
  const isParentPath = pathname.startsWith(`/${correctedSlug}/`);

  // Ne prendre en compte que les correspondances exactes pour la sélection, pas les chemins parents
  const isSelected = isExactMatch;

  // Utiliser ceci pour l'état ouvert de l'accordéon - si c'est un parent ou une correspondance exacte
  const isActive = isExactMatch || isParentPath || isTopLevelMatch;

  // Vérifier si le chemin courant est dans cette section en comparant les segments de chemin
  // Plus fiable pour les routes imbriquées en profondeur
  const isPathWithinSection = (() => {
    // Ignorer cette vérification pour les chemins vides
    if (!correctedSlug) return false;

    const sectionSegments = correctedSlug.split('/').filter(Boolean);

    // S'il n'y a pas assez de segments dans le chemin, il ne peut pas être dans cette section
    if (pathSegments.length < sectionSegments.length) return false;

    // Vérifier si tous les segments de section correspondent aux segments de chemin correspondants
    for (let i = 0; i < sectionSegments.length; i++) {
      if (pathSegments[i] !== sectionSegments[i]) {
        return false;
      }
    }

    return true;
  })();

  // Pour les sections accordéon, vérifier si le chemin d'un enfant est dans l'URL courante
  const hasActiveChild = item.children?.some(child => {
    const childSlug = child.slug;
    const childSegments = childSlug.split('/').filter(Boolean);

    // Vérifier si les segments du chemin correspondent aux segments de cet enfant
    if (pathSegments.length >= childSegments.length) {
      for (let i = 0; i < childSegments.length; i++) {
        if (pathSegments[i] !== childSegments[i]) {
          return false;
        }
      }
      return true;
    }

    return false;
  });

  // Vérifier si la section courante doit être ouverte selon la correspondance de chemin
  // Cela garantit que la section est ouverte quand on arrive sur une page de cette section
  const shouldBeOpen = isSelected || hasActiveChild || isParentPath || isPathWithinSection;

  if (item.children) {
    return (
      <Row
        fillWidth 
        style={{paddingLeft: `calc(${depth} * var(--static-space-8))`}}>
        <Column
          fillWidth
          marginTop="2">
          {layout.sidebar.collapsible ? (
          <Accordion
            gap="2"
            icon="chevronRight"
            iconRotation={90}
            size="s"
            radius="s"
            paddingX={undefined}
            paddingBottom={undefined}
            paddingLeft="4"
            paddingTop="4"
            open={shouldBeOpen}
            title={
              <Row textVariant="label-strong-s" onBackground="brand-strong">
                {item.title}
              </Row>
            }>
              {renderNavigation(item.children, depth + 1)}
          </Accordion>
          ) : (
            <Column
              gap="2"
              paddingLeft="4"
              paddingTop="4">
                <Row 
                  paddingY="12" paddingLeft="8" textVariant="label-strong-s" onBackground="brand-strong">
                  {item.title}
                </Row>
                {renderNavigation(item.children, depth + 1)}
            </Column>
          )}
        </Column>
      </Row>
    );
  }

  return (
    <ToggleButton
      fillWidth
      horizontal="between"
      selected={isSelected}
      className={depth === 0 ? styles.navigation : undefined}
      href={`/${correctedSlug}`}>
      <Row fillWidth horizontal="between" vertical="center">
        <Row
          overflow="hidden"
          gap="8"
          onBackground={isSelected ? "neutral-strong" : "neutral-weak"}
          textVariant={isSelected ? "label-strong-s" : "label-default-s"}
          style={{ textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
            {item.navIcon && <Icon size="xs" name={item.navIcon}/>}
            {item.label || item.title}
        </Row>
        {item.navTag && (
          <Tag data-theme="dark" data-brand={item.navTagVariant} style={{marginRight: "-0.5rem", transform: "scale(0.8)", transformOrigin: "right center"}} variant="brand" size="s">
              {item.navTag}
          </Tag>
        )}
      </Row>
    </ToggleButton>
  );
};

// Ajouter un displayName et mémoïser avec une fonction de comparaison moins agressive
const NavigationItem = React.memo(NavigationItemComponent, (prevProps, nextProps) => {
  // Toujours re-rendre si le chemin change - critique pour les mises à jour d'état actif
  if (prevProps.pathname !== nextProps.pathname) {
    return false; // Chemin différent = re-rendu nécessaire
  }

  // Sinon, ne re-rendre que si l'élément lui-même change
  return prevProps.item === nextProps.item;
});

NavigationItem.displayName = 'NavigationItem';

// Composant de lien de ressource mémoïsé
const ResourceLinkComponent: React.FC<{
  href: string;
  icon: string;
  label: string;
  pathname: string;
}> = ({ href, icon, label, pathname }) => {
  const isSelected = pathname === href;
  
  return (
    <ToggleButton
      fillWidth
      horizontal="between"
      selected={isSelected}
      className={styles.navigation}
      href={href}>
      <Row 
        gap="8"
        onBackground={isSelected ? "neutral-strong" : "neutral-weak"}
        textVariant={isSelected ? "label-strong-s" : "label-default-s"}>
        <Icon size="xs" name={icon}/>
        {label}
      </Row>
    </ToggleButton>
  );
};

// Ajouter un displayName et mémoïser avec une fonction de comparaison moins agressive
const ResourceLink = React.memo(ResourceLinkComponent, (prevProps, nextProps) => {
  // Toujours re-rendre si le chemin change - critique pour les mises à jour d'état actif
  if (prevProps.pathname !== nextProps.pathname) {
    return false; // Chemin différent = re-rendu nécessaire
  }

  // Sinon, ne re-rendre que si le href ou l'icône change
  return prevProps.href === nextProps.href && prevProps.icon === nextProps.icon;
});

ResourceLink.displayName = 'ResourceLink';

// Créer une version stable de la barre latérale qui ne se re-rend pas inutilement
const SidebarContent: React.FC<{
  navigation: NavigationItem[];
  pathname: string;
}> = React.memo(({ navigation, pathname }) => {
  // Créer une fonction de rendu qui capture le chemin courant
  const renderNavigation = (items: NavigationItem[], depth = 0) => {
    return (
      <>
        {items.map((item) => (
          <NavigationItem 
            key={item.slug}
            item={item}
            depth={depth}
            pathname={pathname}
            renderNavigation={renderNavigation}
          />
        ))}
      </>
    );
  };

  // Créer la section Ressources
  const resourcesSection = (!(routes['/roadmap'] || routes['/changelog'])) ? null : (
    <Column gap="2" marginTop="32" paddingLeft="4">
      <Row textVariant="label-strong-s" onBackground="brand-strong" paddingLeft="8" paddingY="12">
        Ressources
      </Row>
      {routes['/roadmap'] && (
        <ResourceLink
          href="/roadmap"
          icon="roadmap"
          label="Feuille de route"
          pathname={pathname}
        />
      )}

      {routes['/changelog'] && (
        <ResourceLink
          href="/changelog"
          icon="changelog"
          label="Changelog"
          pathname={pathname}
        />
      )}
    </Column>
  );

  return (
    <>
      {renderNavigation(navigation, 0)}
      {resourcesSection}
    </>
  );
}, (prevProps, nextProps) => {
  // Toujours re-rendre si le chemin change
  if (prevProps.pathname !== nextProps.pathname) {
    return false; // Chemin différent = re-rendu nécessaire
  }

  // Sinon, ne re-rendre que si la navigation change
  return prevProps.navigation === nextProps.navigation;
});

SidebarContent.displayName = 'SidebarContent';

const Sidebar: React.FC<SidebarProps> = ({ initialNavigation, ...rest }) => {
  const [navigation, setNavigation] = useState<NavigationItem[]>(initialNavigation || []);
  const [hasLoaded, setHasLoaded] = useState(false);
  const pathname = usePathname();
  
  // Charger les données de navigation une seule fois, en utilisant le cache global
  useEffect(() => {
    // Utiliser initialNavigation si fourni
    if (initialNavigation && initialNavigation.length > 0) {
      setNavigation(initialNavigation);
      globalNavigationCache = initialNavigation;
      setHasLoaded(true);
      return;
    }

    // Utiliser le cache global si disponible
    if (globalNavigationCache) {
      setNavigation(globalNavigationCache);
      setHasLoaded(true);
      return;
    }

    // Charger seulement si pas encore chargé et pas de cache global
    if (!hasLoaded) {
      fetch("/api/navigation")
        .then((res) => res.json())
        .then((data) => {
          setNavigation(data);
          globalNavigationCache = data; // Mettre en cache globalement
          setHasLoaded(true);
        })
        .catch((err) => {
          console.error("Échec du chargement de la navigation", err);
          setHasLoaded(true);
        });
    }
  }, [initialNavigation, hasLoaded]);

  // Créer un conteneur stable qui ne change pas
  const containerStyle = useMemo(() => ({
    maxHeight: "calc(100vh - var(--static-space-80))"
  }), []);

  return (
    <Column 
      width={layout.sidebar.width} 
      minWidth={layout.sidebar.width} 
      position="sticky" 
      top="56" 
      fitHeight 
      gap="2" 
      as="nav" 
      overflowY="auto" 
      paddingX="8"
      paddingY="16"
      style={containerStyle} 
      {...rest}
    >
      {hasLoaded && <SidebarContent key={pathname} navigation={navigation} pathname={pathname} />}
    </Column>
  );
};

// Utiliser une fonction de comparaison personnalisée pour le composant Sidebar entier
const MemoizedSidebar = React.memo(Sidebar, (prevProps, nextProps) => {
  // Ne re-rendre que si initialNavigation change
  // Le composant se re-rendra quand le chemin change via le hook usePathname en interne
  return prevProps.initialNavigation === nextProps.initialNavigation;
});

MemoizedSidebar.displayName = 'MemoizedSidebar';

export { MemoizedSidebar as Sidebar };