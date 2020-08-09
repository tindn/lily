import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import theme from '../theme';

export function Input({ style, textStyle, ...otherProps }) {
  return (
    <TextInput
      style={StyleSheet.flatten([
        { color: theme.colors.white },
        style,
        textStyle,
      ])}
      placeholderTextColor={theme.colors.lightGray}
      secu
      {...otherProps}
    ></TextInput>
  );
}
