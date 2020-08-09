import React from 'react';
import { Text } from 'components';
import { View } from 'react-native';
import theme from '../../theme';

export default function SwipeToDeleteContent() {
  return (
    <View
      style={{
        backgroundColor: theme.colors.red,
        justifyContent: 'center',
        flex: 1,
      }}
    >
      <Text
        style={{
          fontWeight: '500',
          fontSize: 18,
          color: theme.colors.white,
          paddingLeft: 10,
        }}
      >
        Delete
      </Text>
    </View>
  );
}
