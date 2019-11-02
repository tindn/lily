import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

function Pill(props) {
  let color = props.color || '#007aff';
  let backgroundColor = props.backgroundColor || '#fff';

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
        },
        props.style,
      ]}
    >
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
    </TouchableOpacity>
  );
}

export default Pill;
