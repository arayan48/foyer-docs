import { type Locale, localePath, t } from "@/i18n";
import { layout, social } from "@/resources/once-ui.config";
import {
  Button,
  Column,
  Icon,
  Logo,
  Row,
  SmartLink,
  ThemeSwitcher,
} from "@once-ui-system/core";

export const Footer = ({ lang }: { lang: Locale }) => {
  const d = t(lang);
  return (
    <Column gap="40" fillWidth paddingY="xl" paddingX="l" horizontal="center" borderTop="neutral-alpha-medium">
      <Row gap="12" textVariant="label-default-m" maxWidth={layout.footer.width} vertical="center">
        <Logo dark href={localePath(lang)} icon="/trademarks/icon-dark.svg" size="m" />
        <Logo light href={localePath(lang)} icon="/trademarks/icon-light.svg" size="m" />
        {/* L'utilisation de ce modèle nécessite une attribution. Ne supprimez pas le lien vers Once UI sauf si vous avez un abonnement Once UI Pro. */}
        <Button
          data-border="rounded"
          size="s"
          weight="default"
          variant="tertiary"
          href="https://once-ui.com/products/magic-docs"
        >
          <Row gap="12" vertical="center">
            {d.footerOnceUi}
            <Icon size="xs" name="arrowUpRight" onBackground="brand-medium" />
          </Row>
        </Button>
      </Row>
      <Row maxWidth={layout.footer.width} horizontal="between" gap="40" wrap paddingX="2">
        <Column gap="12" textVariant="label-default-m">
          <Row paddingX="2" marginBottom="8">
            {d.products}
          </Row>
          <Row>
            <SmartLink href="https://once-ui.com/products/once-ui-core">Once UI</SmartLink>
          </Row>
          <Row>
            <SmartLink href="https://once-ui.com/products/magic-portfolio">Magic Portfolio</SmartLink>
          </Row>
          <Row>
            <SmartLink href="https://once-ui.com/products/magic-store">Magic Store</SmartLink>
          </Row>
          <Row>
            <SmartLink href="https://once-ui.com/products/magic-docs">Magic Docs</SmartLink>
          </Row>
          <Row>
            <SmartLink href="https://once-ui.com/products/magic-bio">Magic Bio</SmartLink>
          </Row>
        </Column>
        <Column gap="12" textVariant="label-default-m">
          <Row paddingX="2" marginBottom="8">
            {d.resources}
          </Row>
          <Row>
            <SmartLink href="https://once-ui.com/about">{d.about}</SmartLink>
          </Row>
          <Row>
            <SmartLink href="https://once-ui.com/terms-of-use">{d.terms}</SmartLink>
          </Row>
          <Row>
            <SmartLink href="https://once-ui.com/privacy-policy">{d.privacy}</SmartLink>
          </Row>
          <Row>
            <SmartLink href="https://once-ui.com/license-agreement">{d.license}</SmartLink>
          </Row>
        </Column>
        <Column data-border="rounded" gap="12" textVariant="label-default-m">
          <Row paddingX="2" marginBottom="8">
            {d.social}
          </Row>
          {social.map((link, index) => (
            <Button key={index} href={link.link} weight="default" prefixIcon={link.icon} label={link.name} size="s" variant="secondary" />
          ))}
        </Column>
      </Row>
      <Row maxWidth={layout.footer.width}>
        <ThemeSwitcher />
      </Row>
    </Column>
  );
};
