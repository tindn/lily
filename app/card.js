import React from 'react';
import { View } from 'react-native';
import theme from '../theme';

function Card(props) {
  const { style, children } = props;
  return (
    <View
      style={[
        {
          flex: 1,
          borderRadius: 5,
          backgroundColor: theme.colors.secondary,
          marginTop: 30,
          marginLeft: 7,
          marginRight: 7,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 3,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export default Card;
