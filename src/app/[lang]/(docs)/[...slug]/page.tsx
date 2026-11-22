import { notFound } from "next/navigation";
import { getPages, getAdjacentPages, sectionTitle as getSectionTitle } from "@/app/utils/utils";
import { formatDate } from "@/app/utils/formatDate";
import { Column, Heading, Icon, Row, Media, Text, Card, HeadingNav, Meta, Schema, Button } from "@once-ui-system/core";
import { alternates, type Locale, localePath, t } from "@/i18n";
import { baseURL, layout, schema } from "@/resources";
import { CustomMDX } from "@/product/mdx";
import { Metadata } from "next";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string[] }>;
}): Promise<Metadata> {
  const routeParams = await params;
  const slugPath = routeParams.slug ? routeParams.slug.join('/') : '';

  const { lang } = routeParams;
  const docs = getPages(lang);
  const doc = docs.find((doc) => doc.slug === slugPath);

  if (!doc) return {};

  const metadata = Meta.generate({
    title: doc.metadata.title + " – " + schema.name,
    description: doc.metadata.summary,
    baseURL,
    path: localePath(lang, doc.slug),
    type: "article",
    publishedTime: doc.metadata.updatedAt,
    image: doc.metadata.image || `/api/og/generate?title=${encodeURIComponent(doc.metadata.title)}&description=${encodeURIComponent(doc.metadata.summary ?? "")}`,
  });
  return { ...metadata, alternates: alternates(lang, `/${doc.slug}`) };
}

export default async function Docs({
  params,
 }: { params: Promise<{ lang: Locale; slug: string[] }> }) {
  const routeParams = await params;
  const { lang } = routeParams;
  const d = t(lang);
  const slugPath = routeParams.slug.join('/');

  let doc = getPages(lang).find((doc) => doc.slug === slugPath);

  if (!doc) {
    notFound();
  }
  
  const { prevPage, nextPage } = getAdjacentPages(lang, slugPath, 'section');
  
  // Déterminer le titre de section - utiliser "Docs" pour les éléments de niveau supérieur
  const sectionTitle = routeParams.slug.length === 1 ? "Docs" : getSectionTitle(lang, routeParams.slug[0]);
  
  return (
    <>
      <Row fillWidth horizontal="center">
        <Column as="main" maxWidth={layout.content.width} gap="l" paddingBottom="xl">
          <Schema
            as="techArticle"
            title={doc.metadata.title + " – " + schema.name}
            description={doc.metadata.summary}
            baseURL={baseURL}
            path={localePath(lang, doc.slug)}
            datePublished={doc.metadata.updatedAt}
            dateModified={doc.metadata.updatedAt}
            image={doc.metadata.image}
            author={{
              name: schema.name
            }}
          />
          <Column fillWidth gap="8" vertical="center" paddingTop="40">
            <Text variant="label-default-l" onBackground="neutral-medium">{sectionTitle}</Text>
            <Heading variant="display-strong-s">{doc.metadata.title}</Heading>
            <Text variant="body-default-s" onBackground="neutral-weak">
              {d.updated} {formatDate(doc.metadata.updatedAt, lang)}
            </Text>
            {doc.metadata.github && (
              <Button className="mt-20" href={"https://github.com/once-ui-system/core/blob/main/packages/core/src/" + doc.metadata.github} size="s" variant="secondary" prefixIcon="github" weight="default" data-border="rounded">
                {d.github}
              </Button>
            )}
          </Column>
          {doc.metadata.image && (
            <Media border="neutral-alpha-medium" enlarge src={doc.metadata.image} alt={d.thumbnail + " " + doc.metadata.title} aspectRatio="16 / 9" radius="m" sizes="(max-width: 768px) 100vw, 768px" priority />
          )}
          <Column as="article" fillWidth>
            <CustomMDX lang={lang} source={doc.content} />
          </Column>
          
          <Row gap="16" fillWidth horizontal="between" s={{direction: "column"}}>              
              {prevPage ? (
                <Row fillWidth>
                <Row maxWidth={20}>
                <Card
                  fillWidth
                  border="neutral-alpha-medium"
                  vertical="center" gap="4"
                  href={localePath(lang, prevPage.slug)} 
                  radius="l" 
                  paddingX="16"
                >
                  <Icon name="chevronLeft" size="s" onBackground="neutral-weak" />
                  <Column gap="4" vertical="center" paddingX="16" paddingY="12">
                    <Text variant="label-default-s" onBackground="neutral-weak">
                      {prevPage.slug.includes('/') ? getSectionTitle(lang, prevPage.slug.split('/')[0]) : 'Docs'}
                    </Text>
                    <Text onBackground="neutral-strong" variant="heading-strong-m" wrap="balance">
                      {prevPage.metadata.title}
                    </Text>
                  </Column>
                </Card>
                </Row>
                </Row>
              ) : <Row/>}
              {nextPage ? (
                <Row fillWidth horizontal="end">
                  <Row maxWidth={20}>
                    <Card
                      fillWidth
                      border="neutral-alpha-medium"
                      horizontal="end" vertical="center" gap="4"
                      href={localePath(lang, nextPage.slug)} 
                      radius="l" 
                      paddingX="16"
                    >
                      <Column horizontal="end" gap="4" vertical="center" paddingX="16" paddingY="12">
                        <Text variant="label-default-s" onBackground="neutral-weak">
                          {nextPage.slug.includes('/') ? getSectionTitle(lang, nextPage.slug.split('/')[0]) : 'Docs'}
                        </Text>
                        <Text onBackground="neutral-strong" variant="heading-strong-m" wrap="balance">
                          {nextPage.metadata.title}
                        </Text>
                      </Column>
                      <Icon name="chevronRight" size="s" onBackground="neutral-weak" />
                    </Card>
                  </Row>
                </Row>
              ) : <Row/>}
            </Row>
        </Column>
      </Row>
      <Column gap="16" maxWidth={layout.sideNav.width} s={{hide: true}} fillHeight paddingLeft="24" borderLeft="neutral-alpha-medium">
        <Column gap="16" position="sticky" top="80" fitHeight>
          <Text variant="label-default-s" onBackground="neutral-medium">{d.onThisPage}</Text>
          <HeadingNav header={false} fitHeight/>
        </Column>
      </Column>
    </>
  );
}