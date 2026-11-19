import React from "react";
import { 
  Column, 
  Row, 
  Heading, 
  Text, 
  Button, 
  Grid,
  Media, 
  Line, 
  StatusIndicator,
  Badge,
  Tag,
  Meta,
  Schema
} from "@once-ui-system/core";
import { baseURL, meta, schema, changelog, roadmap, routes } from "@/resources";
import { formatDate } from "./utils/formatDate";
import { PageList } from "@/product/PageList";

export async function generateMetadata() {
  return Meta.generate({
    title: meta.home.title,
    description: meta.home.description,
    baseURL: baseURL,
    path: meta.home.path,
    image: meta.home.image
  });
}

// Calculer les statistiques de progression de la feuille de route
const calculateRoadmapStats = () => {
  let totalTasks = 0;
  let inProgressTasks = 0;
  let completedTasks = 0;
  
  roadmap.forEach(product => {
    product.columns.forEach(column => {
      totalTasks += column.tasks.length;
      
      if (column.title === "En cours") {
        inProgressTasks += column.tasks.length;
      }

      if (column.title === "Terminé") {
        completedTasks += column.tasks.length;
      }
    });
  });
  
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  return {
    totalTasks,
    inProgressTasks,
    completedTasks,
    progressPercentage
  };
};

const roadmapStats = calculateRoadmapStats();

// Récupérer la dernière entrée du changelog
const latestChangelogEntry = changelog[0];

export default function Home() {
  return (
    <Column maxWidth={56} gap="xl">
      <Schema
        as="webPage"
        title={meta.home.title}
        description={meta.home.description}
        baseURL={baseURL}
        path={meta.home.path}
        author={{
          name: schema.name
        }}
      />
      
      {/* Section héro */}
      <Column fillWidth gap="l" paddingTop="l">
        <Row fillWidth gap="l">
          <Column maxWidth="xs" gap="12">
            <Badge
              background="overlay"
              paddingLeft="4"
              paddingRight="16"
              paddingY="4"
              border="neutral-alpha-medium"
              href="/introduction"
              vertical="center"
              marginBottom="12"
            >
                <Tag data-border="rounded" marginRight="12">Docs</Tag>
                <Text
                  variant="label-default-s"
                  onBackground="neutral-weak"
                >
                  Minecraft et FiveM, sur Windows et Linux
                </Text>
            </Badge>
            <Heading variant="display-strong-s">
              Documentation de Foyer
            </Heading>
            <Text wrap="balance" onBackground="neutral-weak" variant="body-default-xl" marginBottom="20">
              Installez Foyer, configurez votre machine et choisissez la bonne RAM pour vos serveurs de jeu.
            </Text>
            <Button data-border="rounded" size="s" href="/introduction" variant="secondary" arrowIcon id="get-started">Commencer</Button>
          </Column>
        </Row>
      </Column>

      <Column fillWidth>
        <Column fillWidth>
          <Text
            variant="display-default-s"
            onBackground="neutral-strong"
          >
            Guides
          </Text>
          <Text
            onBackground="neutral-weak"
            marginTop="8"
          >
            De l'installation au premier joueur connecté
          </Text>
        </Column>
        <PageList depth={1} thumbnail={true} marginTop="24" minHeight={14}/>
        <Heading as="h2" variant="display-default-xs" marginTop="48">
          Serveurs de jeu
        </Heading>
        <Grid fillWidth columns="2" s={{columns: "1"}} gap="8" marginTop="24">
          <PageList path={["serveurs"]} description={false}/>
        </Grid>
      </Column>
      
      {/* Section dernière mise à jour */}
      {routes['/changelog'] && (
       <Column 
          maxWidth={56}
          background="overlay"
          radius="l"
          border="neutral-alpha-weak"
        >
        <Column paddingX="32" paddingY="24" fillWidth horizontal="between" s={{direction: "column"}} gap="4">
          <Row fillWidth vertical="center" horizontal="between" gap="16" wrap>
            <Heading as="h2" variant="display-default-xs">
              Dernière mise à jour
            </Heading>
            <Button data-border="rounded" weight="default" variant="secondary" href="/changelog" size="s" suffixIcon="chevronRight">
              Tous les changements
            </Button>
          </Row>
          <Text variant="label-default-s" onBackground="neutral-weak">
            {formatDate(latestChangelogEntry.date)}
          </Text>
        </Column>
        
        <Column fillWidth>
          {latestChangelogEntry.image && (
            <Media
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              radius="l"
              src={latestChangelogEntry.image} 
              alt={`Illustration pour ${latestChangelogEntry.title}`}
              border="neutral-alpha-weak"
              aspectRatio="16 / 9"
            />
          )}
          <Column fillWidth gap="4" paddingX="32" paddingY="24">
            <Heading as="h3">
              {latestChangelogEntry.title}
            </Heading>

            {latestChangelogEntry.description && (
              <Text variant="body-default-m" onBackground="neutral-weak">
                {latestChangelogEntry.description}
              </Text>
            )}
          </Column>
        </Column>
      </Column>
      )}
      
      {/* Section progression de la feuille de route */}
      {routes['/roadmap'] && (
      <Column 
        maxWidth={56}
        background="overlay"
        radius="l"
        border="neutral-alpha-weak"
      >
        <Column paddingX="32" paddingY="24" fillWidth horizontal="between" s={{direction: "column"}} gap="4">
          <Row fillWidth vertical="center" horizontal="between" gap="16" wrap>
            <Heading as="h2" variant="display-default-xs">
              Feuille de route T2 2025
            </Heading>
            <Button data-border="rounded" weight="default" variant="secondary" href="/roadmap" size="s" suffixIcon="chevronRight">
            Voir la feuille de route
          </Button>
          </Row>
          <Text variant="label-default-s" onBackground="neutral-weak">
            Avancement et état des tâches
          </Text>
        </Column>
        
        <Line background="neutral-alpha-weak" />
        
        <Row fillWidth padding="32" gap="20" position="relative" s={{direction: "column"}}>
          <Row fillWidth gap="12">
            {/* Progression globale */}
            <Column fillWidth gap="8" paddingTop="8">
              <Column fillWidth gap="20">
                <Column fillWidth horizontal="center" gap="4">
                  <Text 
                    variant="display-strong-l" 
                    onBackground="neutral-strong"
                  >
                    {roadmapStats.progressPercentage}%
                  </Text>
                  <Text
                    align="center"
                    variant="label-default-s"
                    onBackground="neutral-weak"
                    marginTop="8"
                  >
                    Progression globale
                  </Text>
                </Column>
                
                <Row
                  height="8"
                  fillWidth
                  overflow="hidden"
                  radius="full"
                  background="neutral-alpha-weak"
                  border="neutral-alpha-weak"
                >
                  <Row
                    fillHeight
                    radius="full"
                    transition="micro-medium"
                    solid="brand-strong"
                    style={{ 
                    width: `${roadmapStats.progressPercentage}%`,
                  }} />
                </Row>
              </Column>
              
              {/* État des tâches */}
              <Grid fillWidth columns="3" s={{columns: "1"}} gap="8" marginTop="24">
                {/* Tâches prévues */}
                <Column 
                  padding="l" 
                  horizontal="center"
                  radius="m" 
                  border="neutral-alpha-weak" 
                  background="overlay"
                  gap="s"
                >
                  <Text 
                    variant="display-default-m" 
                    onBackground="neutral-strong"
                  >
                    {roadmapStats.totalTasks - roadmapStats.completedTasks - roadmapStats.inProgressTasks}
                  </Text>
                  <Row vertical="center" gap="8">
                    <StatusIndicator color="blue" />
                    <Text
                      variant="label-default-s"
                      onBackground="neutral-weak"
                    >
                      Prévu
                    </Text>
                  </Row>
                </Column>
                
                {/* Tâches en cours */}
                <Column 
                  padding="l" 
                  horizontal="center"
                  radius="m" 
                  border="neutral-alpha-weak" 
                  background="overlay"
                  gap="s"
                >
                  <Text 
                    variant="display-default-m" 
                    onBackground="neutral-strong"
                  >
                    {roadmapStats.inProgressTasks}
                  </Text>
                  <Row vertical="center" gap="8">
                    <StatusIndicator color="yellow" />
                    <Text
                      variant="label-default-s"
                      onBackground="neutral-weak"
                    >
                      En cours
                    </Text>
                  </Row>
                </Column>

                {/* Tâches terminées */}
                <Column 
                  padding="l" 
                  horizontal="center"
                  radius="m" 
                  border="neutral-alpha-weak" 
                  background="overlay"
                  gap="s"
                >
                  <Text 
                    variant="display-default-m" 
                    onBackground="neutral-strong"
                  >
                    {roadmapStats.completedTasks}
                  </Text>
                  <Row vertical="center" gap="8">
                    <StatusIndicator color="green" />
                    <Text
                      variant="label-default-s"
                      onBackground="neutral-weak"
                    >
                      Terminé
                    </Text>
                  </Row>
                </Column>
              </Grid>
            </Column>
          </Row>
        </Row>
      </Column>
      )}
    </Column>
  );
}
