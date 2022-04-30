import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import theme from '../theme';

export function Button({
  style,
  children,
  textStyle,
  color,
  isOutline,
  ...otherProps
}) {
  let buttonColor = color || theme.colors.primary;
  let backgroundColor = buttonColor;
  let borderColor = 'transparent';
  let textColor = theme.colors.white;
  
  if (isOutline) {
    backgroundColor = 'transparent';
    borderColor = buttonColor;
    textColor = buttonColor;
    if (otherProps.disabled) {
      borderColor = theme.colors.darkGray;
    }
  }
  if (otherProps.disabled) {
    backgroundColor = theme.colors.darkGray;
    textColor = theme.colors.lightGray;
  }
  return (
    <TouchableOpacity
      style={StyleSheet.flatten([
        {
          backgroundColor,
          borderRadius: 5,
          padding: 10,
          borderColor,
          borderWidth: 1,
          justifyContent: 'center',
        },
        style,
      ])}
      {...otherProps}
    >
      <Text
        style={StyleSheet.flatten([
          {
            color: textColor,
            textAlign: 'center',
          },
          textStyle,
        ])}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}
