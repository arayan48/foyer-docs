'use client';

import { Column, Heading, Text, Button } from '@once-ui-system/core';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Column maxWidth="s" gap="24" padding="32" align="center" horizontal="center" >
      <Heading variant="display-strong-s">Oups ! Quelque chose s&apos;est cassé...</Heading>
      <Text wrap="balance" marginBottom="8">
        Une erreur s&apos;est produite lors du rendu de cette page. Voici ce qui s&apos;est passé :
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
        Réessayer
      </Button>
    </Column>
  );
}
