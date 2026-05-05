import { View, type ViewProps } from 'react-native';

import { CorTema } from '@/constants/tema';
import { useTema } from '@/hooks/use-tema';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: CorTema;
};

export function ViewTema({ style, lightColor, darkColor, type, ...otherProps }: ThemedViewProps) {
  const theme = useTema();

  return <View style={[{ backgroundColor: theme[type ?? 'background'] }, style]} {...otherProps} />;
}
