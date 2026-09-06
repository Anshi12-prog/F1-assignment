import React from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';
import { colors, typography, TypographyToken } from '@/theme';
import type { ColorToken } from '@/theme';

interface Props extends TextProps {
  variant?: TypographyToken;
  color?: ColorToken;
  align?: TextStyle['textAlign'];
  style?: StyleProp<TextStyle>;
}

/**
 * Every string in the Marketplace renders through here.
 *
 * It is the enforcement point for the type scale - a component cannot invent a
 * font size without going out of its way, which is what keeps the section
 * visually identical to the rest of the app.
 */
export function AppText({
  variant = 'body',
  color,
  align,
  style,
  children,
  ...rest
}: Props) {
  return (
    <Text
      {...rest}
      style={[
        typography[variant] as TextStyle,
        color ? { color: colors[color] } : null,
        align ? { textAlign: align } : null,
        style,
      ]}
    >
      {children}
    </Text>
  );
}
