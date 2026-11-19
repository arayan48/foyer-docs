"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button, Flex, Logo, NavIcon, Row, Kbar, useTheme, Animation } from "@once-ui-system/core";
import { layout, routes } from "@/resources/once-ui.config";
import { Sidebar, NavigationItem } from "./Sidebar";

export function Header() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setSidebarVisible(false);
  }, [pathname]);

  useEffect(() => {
    setIsMac(navigator.userAgent.toLowerCase().indexOf('mac') !== -1);
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  
  useEffect(() => {
    fetch("/api/navigation")
      .then((res) => res.json())
      .then((data) => {
        setNavigationItems(data);
      })
      .catch((err) => console.error("Échec du chargement de la navigation", err));
  }, []);

  // Fonction pour convertir les éléments de navigation en éléments Kbar récursivement
  const convertToKbarItems = (items: NavigationItem[]) => {
    const kbarItems: any[] = [];

    items.forEach((item) => {
      if (item.children) {
        // C'est une section/catégorie
        // Ajouter les éléments enfants avec le nom de cette section
        const childItems = convertToKbarItems(item.children);
        childItems.forEach(child => {
          child.section = item.title;
        });
        kbarItems.push(...childItems);
      } else {
        const correctedSlug = item.slug.replace(/^src\\content\\/, '').replace(/\\/g, '/');
        
        const defaultKeywords = `${item.title.toLowerCase()}, docs, documentation`;
        const keywords = item.keywords || defaultKeywords;
        
        kbarItems.push({
          id: correctedSlug,
          name: item.label || item.title,
          section: "Documentation",  // section de recherche
          shortcut: [],
          keywords: keywords,
          href: `/${correctedSlug}`,
          icon: item.navIcon || "document",
        });
      }
    });
    
    return kbarItems;
  };

  const docsItems = convertToKbarItems(navigationItems);
  const { theme, setTheme } = useTheme();

  const navigationKbarItems = [
    {
      id: "home",
      name: "Accueil",
      section: "Navigation",
      shortcut: [],
      keywords: "accueil, page d'accueil",
      href: "/",
      icon: "home",
    }
  ];
  
  if (routes['/changelog']) {
    navigationKbarItems.push({
      id: "changelog",
      name: "Changelog",
      section: "Navigation",
      shortcut: [],
      keywords: "changelog, page changelog",
      href: "/changelog",
      icon: "changelog",
    });
  }
  
  if (routes['/roadmap']) {
    navigationKbarItems.push({
      id: "roadmap",
      name: "Feuille de route",
      section: "Navigation",
      shortcut: [],
      keywords: "feuille de route, roadmap",
      href: "/roadmap",
      icon: "roadmap",
    });
  }

  const kbar = [
    ...navigationKbarItems,
    ...docsItems,
    {
      id: "theme-toggle",
      name: theme === 'dark' ? "Mode clair" : "Mode sombre",
      section: "Thème",
      shortcut: [],
      keywords: "mode clair, mode sombre, thème, basculer, apparence",
      perform: () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      },
      icon: theme === 'dark' ? "light" : "dark",
    },
  ];

  useEffect(() => {
    if (sidebarVisible) {
      // Sauvegarder la position de défilement courante
      const scrollY = window.scrollY;
      // Ajouter des styles pour bloquer le défilement tout en maintenant la position
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restaurer la position de défilement quand la barre latérale est fermée
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }

    return () => {
      // Fonction de nettoyage pour s'assurer que le défilement est restauré
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [sidebarVisible]);

  return (
    <>
      <Flex as="header" background="page" horizontal="center" position="sticky" zIndex={9} fillWidth vertical="center" paddingY="12" paddingRight="16" paddingLeft="12" borderBottom="neutral-alpha-medium">
        <Row maxWidth={layout.header.width} vertical="center" horizontal="between" gap="l">
          <Row fillWidth vertical="center" gap="8">
            <Animation
              triggerType="click"
              active={sidebarVisible}
              slideDown={1}
              scale={0.9}
              blur={0.5}
              duration={200}
              trigger={
                <NavIcon hide m={{hide: false}} onClick={toggleSidebar} isActive={sidebarVisible}/>
              }>
              <Row
                width={24}
                style={{height: "calc(100vh - var(--static-space-64))", top: "3.25rem", left: "-1.5rem"}} 
                background="page" 
                position="fixed"
                borderTop="neutral-alpha-medium"
                borderRight="neutral-alpha-medium"
                zIndex={9}>
                <Sidebar
                  data-scaling="110"
                  fillWidth
                  width={undefined}
                  padding="8" 
                />
              </Row>
            </Animation>
            <Logo dark wordmark="/trademarks/type-dark.svg" size="s" href="/"/>
            <Logo light wordmark="/trademarks/type-light.svg" size="s" href="/"/>
          </Row>
          <Kbar s={{hide: true}} items={kbar} radius="full" background="neutral-alpha-weak">
            <Button data-border="rounded" size="s" variant="tertiary" weight="default">
              <Row vertical="center" gap="16" style={{marginLeft: '-0.5rem'}} paddingRight="8">
                <Row background="neutral-alpha-medium" paddingX="8" paddingY="4" radius="full" data-scaling="90" textVariant="body-default-xs" onBackground="neutral-medium">{isMac ? 'Cmd' : 'Ctrl'} k</Row>
                Rechercher dans la doc...
              </Row>
            </Button>
          </Kbar>
          <Row fillWidth horizontal="end" gap="8" data-border="rounded">
            <Row s={{hide: true}}>
              <Button size="s" variant="secondary" href="https://foyer.cfd">
                Site
              </Button>
            </Row>
            <Button href="https://github.com/arayan48/foyer/releases/latest" size="s">
              Télécharger
            </Button>
          </Row>
        </Row>
      </Flex>
    </>
  );
};
