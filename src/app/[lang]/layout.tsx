import '@once-ui-system/core/css/styles.css';
import '@once-ui-system/core/css/tokens.css';
import '../foyer.css';

import classNames from "classnames";

import { Footer, Header, Sidebar } from "@/product";
import { baseURL } from "@/resources";

import { Background, Column, Flex, Meta, Row } from "@once-ui-system/core";
import { effects, fonts, layout, schema } from "@/resources/once-ui.config";
import { meta } from "@/resources";
import { isLocale, locales, ogLocales, t } from "@/i18n";
import getNavigation from "@/app/utils/getNavigation";
import { notFound } from "next/navigation";
import { Providers } from '@/product/Providers';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Pick<RootLayoutProps, "params">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = t(lang);
  const baseMetadata = Meta.generate({
    title: d.metaTitle,
    description: d.metaDescription,
    baseURL: baseURL,
    path: meta.home.path,
    image: meta.home.image
  });

  return {
    ...baseMetadata,
    metadataBase: new URL(`${baseURL}`),
    openGraph: {
      ...baseMetadata.openGraph,
      siteName: schema.name,
      locale: ogLocales[lang],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const navigation = getNavigation(lang);

  return (
    <>
      <Flex
        as="html"
        lang={lang}
        suppressHydrationWarning
        className={classNames(
          fonts.heading.variable,
          fonts.body.variable,
          fonts.label.variable,
          fonts.code.variable,
        )}
      >
        <head>
          <script
            // biome-ignore lint/security/noDangerouslySetInnerHtml: <Ce n'est pas dynamique et ne présente pas de risque de sécurité.>
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                try {
                  const root = document.documentElement;
                  
                  const defaultTheme = 'system';
                  root.setAttribute('data-neutral', 'sand');
                  root.setAttribute('data-brand', 'orange');
                  root.setAttribute('data-accent', 'orange');
                  root.setAttribute('data-solid', 'color');
                  root.setAttribute('data-solid-style', 'flat');
                  root.setAttribute('data-border', 'playful');
                  root.setAttribute('data-surface', 'translucent');
                  root.setAttribute('data-transition', 'all');
                  root.setAttribute('data-scaling', '100');
                  root.setAttribute('data-viz-style', 'categorical');
                  
                  const resolveTheme = (themeValue) => {
                    if (!themeValue || themeValue === 'system') {
                      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    }
                    return themeValue;
                  };
                  
                  const theme = localStorage.getItem('data-theme');
                  const resolvedTheme = resolveTheme(theme);
                  root.setAttribute('data-theme', resolvedTheme);
                  
                  const styleKeys = ['neutral', 'brand', 'accent', 'solid', 'solid-style', 'viz-style', 'border', 'surface', 'transition', 'scaling'];
                  styleKeys.forEach(key => {
                    const value = localStorage.getItem('data-' + key);
                    if (value) {
                      root.setAttribute('data-' + key, value);
                    }
                  });
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
              `,
            }}
          />
        </head>
        <Providers>
        <Column background="page" as="body" fillWidth margin="0" padding="0" style={{ minHeight: "100vh" }}>
        <Background
          position="fixed"
          mask={{
            cursor: effects.mask.cursor,
            x: effects.mask.x,
            y: effects.mask.y,
              radius: effects.mask.radius,
            }}
            gradient={{
              display: effects.gradient.display,
              x: effects.gradient.x,
              y: effects.gradient.y,
              width: effects.gradient.width,
              height: effects.gradient.height,
              tilt: effects.gradient.tilt,
              colorStart: effects.gradient.colorStart,
              colorEnd: effects.gradient.colorEnd,
              opacity: effects.gradient.opacity as
                | 0
                | 10
                | 20
                | 30
                | 40
                | 50
                | 60
                | 70
                | 80
                | 90
                | 100,
            }}
            dots={{
              display: effects.dots.display,
              color: effects.dots.color,
              size: effects.dots.size as any,
              opacity: effects.dots.opacity as any,
            }}
            grid={{
              display: effects.grid.display,
              color: effects.grid.color,
              width: effects.grid.width as any,
              height: effects.grid.height as any,
              opacity: effects.grid.opacity as any,
            }}
            lines={{
              display: effects.lines.display,
              opacity: effects.lines.opacity as any,
            }}
          />
          <Header lang={lang} navigation={navigation} />
          <Flex
            fillWidth
            horizontal="center"
            flex={1}
          >
            <Flex horizontal="center" maxWidth={layout.body.width} minHeight="0">
                <Row fillWidth gap="24">
                  <Sidebar lang={lang} navigation={navigation} style={{minHeight: '100vh'}} m={{hide: true}} borderRight="neutral-alpha-medium" />
                  <Row className="page-content" fillWidth horizontal="center">
                    {children}
                  </Row>
                </Row>
            </Flex>
          </Flex>
          <Footer lang={lang} />
        </Column>
        </Providers>
      </Flex>
    </>
  );
}
