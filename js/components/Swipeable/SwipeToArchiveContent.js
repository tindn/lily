import React from 'react';
import { Text, View } from 'react-native';
import theme from '../../theme';

export default function SwipeToArchiveContent() {
  return (
    <View
      style={{
        backgroundColor: theme.colors.primary,
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
        Archive
      </Text>
    </View>
  );
}
