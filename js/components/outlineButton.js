import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import sharedStyles from '../sharedStyles';
import theme from '../theme';

const OutlineButton = props => {
  let color = props.color || '#007aff';
  if (props.disabled) {
    color = theme.colors.lightGray;
  }
  let backgroundColor = '#fff';
  let label = props.labelElement || (
    <Text
      style={[
        {
          color,
        },
        props.textStyle,
      ]}
    >
      {props.label}
    </Text>
  );

  return (
    <TouchableOpacity
      onPress={() => {
        if (props.disabled) {
          return;
        }
        props.onPress();
      }}
      style={[
        {
          backgroundColor,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: color,
        },
        sharedStyles.outlineButton,
        props.style,
      ]}
    >
      {label}
    </TouchableOpacity>
  );
};

export default OutlineButton;
