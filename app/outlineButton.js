import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const OutlineButton = props => {
  let color = props.color || '#007aff';
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
          // opacity: props.disabled ? 0.2 : 1
        },
        props.style,
      ]}
    >
      {label}
    </TouchableOpacity>
  );
};

export default OutlineButton;
