/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/tema';
import { useEsquemaCores } from '@/hooks/use-esquema-cores';

export function useTema() {
  const scheme = useEsquemaCores();
  const theme = scheme === 'unspecified' ? 'light' : scheme;

  return Colors[theme];
}
