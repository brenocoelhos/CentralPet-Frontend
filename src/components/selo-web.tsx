import { version } from 'expo/package.json';
import { Image } from 'expo-image';
import React from 'react';
import { useColorScheme as useEsquemaCores, StyleSheet } from 'react-native';

import { TextoTema } from './texto-tema';
import { ViewTema } from './view-tema';

import { Spacing } from '@/constants/tema';

export function SeloWeb() {
  const scheme = useEsquemaCores();

  return (
    <ViewTema style={styles.container}>
      <TextoTema type="code" themeColor="textSecondary" style={styles.versionText}>
        v{version}
      </TextoTema>
      <Image
        source={
          scheme === 'dark'
            ? require('@/assets/images/expo-badge-white.png')
            : require('@/assets/images/expo-badge.png')
        }
        style={styles.badgeImage}
      />
    </ViewTema>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.five,
    alignItems: 'center',
    gap: Spacing.two,
  },
  versionText: {
    textAlign: 'center',
  },
  badgeImage: {
    width: 123,
    aspectRatio: 123 / 24,
  },
});
