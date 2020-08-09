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
  if (otherProps.disabled) {
    backgroundColor = theme.colors.darkGray;
  }
  if (isOutline) {
    backgroundColor = 'transparent';
    borderColor = buttonColor;
    if (otherProps.disabled) {
      borderColor = theme.colors.darkGray;
    }
  }
  return (
    <TouchableOpacity
      style={StyleSheet.flatten([
        {
          backgroundColor,
          borderRadius: 5,
          paddingVertical: 10,
          paddingHorizontal: 12,
          borderColor,
          borderWidth: 1,
          justifyContent: 'center'
        },
        style,
      ])}
      {...otherProps}
    >
      <Text
        style={StyleSheet.flatten([
          {
            color: otherProps.disabled
              ? theme.colors.lightGray
              : theme.colors.white,
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
