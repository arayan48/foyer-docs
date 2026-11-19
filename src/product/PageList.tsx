import { getPages, sortPages } from "@/app/utils/utils";
import { Card, Column, Icon, Row, Media, Text } from "@once-ui-system/core";
import React from "react";

interface props extends Omit<React.ComponentProps<typeof Card>, 'onClick'> {
  range?: [number] | [number, number];
  thumbnail?: boolean;
  path?: string[];
  description?: boolean;
  sortType?: 'order' | 'alphabetical' | 'date' | 'section';
  depth?: number;
}

function formatSlug(slug: string): React.JSX.Element {
  // Découper le slug par '/'
  const parts = slug.split('/');

  // Supprimer la dernière partie (c'est le titre)
  const pathParts = parts.slice(0, -1);

  // S'il n'y a pas de parties de chemin, retourner un fragment vide
  if (pathParts.length === 0) {
    return <></>;
  }

  // Formater chaque partie pour capitaliser la première lettre de chaque mot
  const formattedParts = pathParts.map(part =>
    part.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
  
  return (
    <Row vertical="center" gap="4">
      {formattedParts.map((part, index) => (
        <React.Fragment key={index}>
          {index > 0 && <Icon name="chevronRight" size="xs" />}
          <Text>{part}</Text>
        </React.Fragment>
      ))}
    </Row>
  );
}

export function PageList({
  range,
  thumbnail = false,
  path = [],
  sortType = 'order', // Valeur par défaut changée de 'date' à 'order' pour respecter l'ordre du meta.json
  depth,
  description = true,
  ...rest
}: props) {
  // Créer un tableau de chemin de base commençant par src/content
  const basePath = ["src", "content"];

  // Combiner le chemin de base avec les segments de chemin supplémentaires
  const fullPath = [...basePath, ...path];

  // Récupérer les pages depuis le chemin spécifié
  let pages = getPages(fullPath);

  // Filtrer les pages par profondeur si spécifié
  if (depth !== undefined) {
    pages = pages.filter(page => {
      // Compter le nombre de slashes dans le slug pour déterminer la profondeur
      // Exclure le préfixe de chemin du comptage
      const pathPrefix = path.join('/');
      const relativePath = pathPrefix ?
        page.slug.replace(pathPrefix + '/', '') :
        page.slug;

      const slashCount = (relativePath.match(/\//g) || []).length;
      return slashCount < depth;
    });
  }

  // Trier les pages avec la fonction de tri centralisée
  const sortedPages = sortPages(pages, sortType);

  const displayedPages = range 
    ? (range.length === 1 
        ? sortedPages.slice(range[0] - 1)
        : sortedPages.slice(range[0] - 1, range[1]))
    : sortedPages;

  return (
    <>
      {displayedPages.length > 0 && displayedPages.map((page) => (
        <Card href={`/${page.slug}`} key={page.slug} radius="l" padding="2" gap="16" s={{direction: "column"}} border="neutral-alpha-weak" fillWidth {...rest}>
          {page.metadata.image && thumbnail && (
            <Media
              priority
              sizes="480px"
              border="neutral-alpha-weak"
              cursor="interactive"
              radius="m"
              src={page.metadata.image}
              alt={"Miniature de " + page.metadata.title}
              aspectRatio="16 / 9"
            />
          )}
          <Column fillWidth gap="4" vertical="center" paddingX="16" paddingY="12">
            <Text variant="label-default-s" onBackground="neutral-weak">
              {formatSlug(page.slug)}
            </Text>
            <Text variant="heading-strong-l" wrap="balance" onBackground="neutral-strong">
              {page.metadata.title}
            </Text>
            {description && page.metadata.summary && (
              <Text variant="body-default-s" onBackground="neutral-medium" marginTop="12" wrap="balance">
                {page.metadata.summary}
              </Text>
            )}
          </Column>
        </Card>
      ))}
    </>
  );
}