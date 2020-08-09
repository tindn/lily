import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import theme from '../theme';

export function Text({ children, style, category, status, ...otherProps }) {
  let textColor = theme.colors.white;
  if (status === 'danger') {
    textColor = theme.colors.red;
  }
  if (status === 'success') {
    textColor = theme.colors.green;
  }
  let fontSize = 16;
  let fontWeight = '500';
  if (category === 'h1') {
    fontSize = 24;
    fontWeight = '700';
  }
  if (category === 'h5') {
    fontWeight = '700';
  }
  if (category === 'h6') {
    fontSize = 15;
    fontWeight = '700';
  }

  if (category === 'c2') {
    fontSize = 18;
  }
  return (
    <RNText
      style={StyleSheet.flatten([
        {
          color: textColor,
          fontSize,
          fontWeight,
        },
        style,
      ])}
      {...otherProps}
    >
      {children}
    </RNText>
  );
}
