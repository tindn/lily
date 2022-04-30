import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import theme from '../theme';

function InputInner({ style, textStyle, ...otherProps }, ref) {
  return (
    <TextInput
      ref={ref}
      style={StyleSheet.flatten([
        {
          color: theme.colors.white,
          backgroundColor: theme.colors.layerOne,
          padding: 10,
          borderRadius: 5,
          fontSize: 16,
        },
        style,
        textStyle,
      ])}
      placeholderTextColor={theme.colors.lightGray}
      {...otherProps}
    ></TextInput>
  );
}

export const Input = React.forwardRef(InputInner);
