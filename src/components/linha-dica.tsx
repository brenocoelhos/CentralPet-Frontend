import React, { type ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

import { TextoTema } from './texto-tema';
import { ViewTema } from './view-tema';

import { Spacing } from '@/constants/tema';

type HintRowProps = {
  title?: string;
  hint?: ReactNode;
};

export function LinhaDica({ title = 'Try editing', hint = 'app/index.tsx' }: HintRowProps) {
  return (
    <View style={styles.stepRow}>
      <TextoTema type="small">{title}</TextoTema>
      <ViewTema type="backgroundSelected" style={styles.codeSnippet}>
        <TextoTema themeColor="textSecondary">{hint}</TextoTema>
      </ViewTema>
    </View>
  );
}

const styles = StyleSheet.create({
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  codeSnippet: {
    borderRadius: Spacing.two,
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
  },
});
