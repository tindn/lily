import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import theme from '../theme';

function Pill(props) {
  let color = props.color || theme.colors.secondary;
  let backgroundColor = props.backgroundColor || theme.colors.primary;

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
          borderRadius: 20,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 3,
          paddingHorizontal: 20,
          paddingVertical: 10,
        },
        props.style,
      ]}
    >
      <Text
        style={[
          {
            color,
            textAlign: 'center',
          },
          props.textStyle,
        ]}
      >
        {props.label}
      </Text>
    </TouchableOpacity>
  );
}

export default Pill;
