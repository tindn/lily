import React from 'react';
import { Layout, Text } from 'react-native-ui-kitten';

export default function LoadingScreen() {
  return (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>loading</Text>
    </Layout>
  );
}
