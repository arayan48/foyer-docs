import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { type Locale, localePath } from "@/i18n";
import React, { ReactNode } from "react";

import { 
  Heading, 
  Row,
  Column,
  Table,
  Media, 
  SmartLink, 
  Text,
  InlineCode, 
  Accordion, 
  AccordionGroup ,
  CodeBlock,
  TextProps,
  HeadingLink,
  MediaProps,
  Card,
  Grid,
  Feedback,
  Button,
  Icon,
  List,
  ListItem,
  Line,
} from "@once-ui-system/core";
import { PageList } from "./PageList";

const onceUIComponents = {
  Table,
  Heading,
  Text,
  Row,
  Media,
  SmartLink,
  InlineCode,
  Accordion,
  AccordionGroup,
  CodeBlock,
  Grid,
  HeadingLink,
  Feedback,
  Button,
  Icon,
  Card,
  Column,
};

type CustomLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

function CustomLink({ href, children, ...props }: CustomLinkProps) {
  return (
    <SmartLink href={href} {...props}>
      {children}
    </SmartLink>
  );
}

function createImage({ alt, src, ...props }: MediaProps & { src: string }) {
  if (!src) {
    console.error("Media nécessite une propriété 'src' valide.");
    return null;
  }

  return (
    <Media
      marginTop="8"
      marginBottom="16"
      enlarge
      radius="m"
      aspectRatio="16 / 9"
      sizes="(max-width: 960px) 100vw, 960px"
      alt={alt}
      src={src}
      {...props}
    />
  );
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-") // Remplacer les espaces par -
    .replace(/&/g, "-and-") // Remplacer & par 'and'
    .replace(/[^\w\-]+/g, "") // Supprimer tous les caractères non-alphanumériques sauf -
    .replace(/\-\-+/g, "-"); // Remplacer les - multiples par un seul -
}

function createList({ children }: { children: ReactNode }) {
  return (
    <List>
      {children}
    </List>
  );
}

function createListItem({ children }: { children: ReactNode }) {
  return (
    <ListItem
      marginTop="4"
      marginBottom="8"
    >
      {children}
    </ListItem>
  );
}

function createHeading(as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
  // Utiliser HeadingLinkProps pour garantir la compatibilité de type
  const CustomHeading = ({ children, ...props }: Omit<React.ComponentProps<typeof HeadingLink>, 'as' | 'id'>) => {
    const slug = slugify(children as string);
    return (
      <HeadingLink
        marginTop="24"
        marginBottom="12"
        as={as}
        id={slug}
        {...props}
      >
        {children}
      </HeadingLink>
    );
  };

  CustomHeading.displayName = `${as}`;

  return CustomHeading;
}

function createParagraph({ children }: TextProps) {
  return (
    <Text
      style={{ lineHeight: "175%" }}
      variant="body-default-m"
      onBackground="neutral-medium"
      marginTop="8"
      marginBottom="12"
    >
      {children}
    </Text>
  );
}

function createInlineCode({ children }: { children: ReactNode }) {
  return <InlineCode>{children}</InlineCode>;
}

function createCodeBlock(props: any) {
  // Pour les balises pre contenant des blocs de code
  if (props.children && props.children.props && props.children.props.className) {
    const { className, children } = props.children.props;

    // Extraire le langage depuis className (format : language-xxx)
    const language = className.replace('language-', '');
    const label = language.charAt(0).toUpperCase() + language.slice(1);
    
    return (
      <CodeBlock
        marginTop="8"
        marginBottom="16"
        codes={[
          {
            code: children,
            language,
            label
          }
        ]}
        copyButton
      />
    );
  }
  
  // Repli pour les autres balises pre ou les blocs de code vides
  return <pre {...props} />;
}

function createHR() {
  return <Line />;
}

const components = {
  p: createParagraph as any,
  h1: createHeading("h1") as any,
  h2: createHeading("h2") as any,
  h3: createHeading("h3") as any,
  h4: createHeading("h4") as any,
  h5: createHeading("h5") as any,
  h6: createHeading("h6") as any,
  img: createImage as any,
  a: CustomLink as any,
  code: createInlineCode as any,
  pre: createCodeBlock as any,
  ul: createList as any,
  ol: createList as any,
  li: createListItem as any,
  hr: createHR as any,
  PageList,
  ...onceUIComponents,
};

type CustomMDXProps = MDXRemoteProps & {
  lang: Locale;
  components?: typeof components;
};

export function CustomMDX({ lang, ...props }: CustomMDXProps) {
  // Ajouter un bloc try-catch pour gérer les erreurs lors du rendu MDX
  try {
    return (
      <MDXRemote
        {...props}
        options={{ blockJS: false, mdxOptions: { remarkPlugins: [remarkGfm] } }}
        components={{
          ...components,
          a: ({ href, ...rest }: CustomLinkProps) => <CustomLink href={href.startsWith("/") ? localePath(lang, href) : href} {...rest} />,
          PageList: (p: React.ComponentProps<typeof PageList>) => <PageList {...p} lang={lang} />,
          ...(props.components || {})
        }}
      />
    );
  } catch (error) {
    console.error('Erreur lors du rendu du contenu MDX :', error);
    
    // Afficher une interface de secours en cas d'erreur
    return (
      <Column gap="16" padding="24" border="accent-medium" radius="m">
        <Text variant="heading-strong-m" onBackground="accent-strong">
          Erreur de rendu du contenu
        </Text>
        <Text variant="body-default-m" onBackground="accent-medium">
          Une erreur s&apos;est produite lors du rendu de ce contenu. Veuillez actualiser la page.
        </Text>
      </Column>
    );
  }
}
