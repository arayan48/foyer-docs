'use client';

import { localeOf, t } from '@/i18n';
import { usePathname } from 'next/navigation';
import { Column, Heading, Text, Button } from '@once-ui-system/core';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const d = t(localeOf(usePathname()));
  return (
    <Column maxWidth="s" gap="24" padding="32" align="center" horizontal="center" >
      <Heading variant="display-strong-s">{d.errorTitle}</Heading>
      <Text wrap="balance" marginBottom="8">
        {d.errorText}
      </Text>
      <Text wrap="balance" variant="code-default-s" onBackground="brand-medium" marginBottom="24">
        {error.message || 'Unknown error'}
      </Text>
      <Button
        prefixIcon="refresh"
        weight="default"
        data-border="rounded"
        onClick={() => reset()}
      >
        {d.retry}
      </Button>
    </Column>
  );
}
