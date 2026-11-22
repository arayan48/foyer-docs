"use client";

import { localeOf, t } from "@/i18n";
import { Column, Heading, Text } from "@once-ui-system/core";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const d = t(localeOf(usePathname()));
  return (
    <Column as="section" fill center paddingY="160">
      <Text marginBottom="s" variant="display-strong-xl">
        404
      </Text>
      <Heading marginBottom="l" variant="display-default-xs">
        {d.notFoundTitle}
      </Heading>
      <Text onBackground="neutral-weak">{d.notFoundText}</Text>
    </Column>
  );
}
