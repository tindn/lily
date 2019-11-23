import firebase from 'firebase';
import React from 'react';
import { View } from 'react-native';
import { Button, Layout, Text } from 'react-native-ui-kitten';
import { runMigrations } from '../db';

export default function Playground() {
  return (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View>
        <Text>This is playground</Text>
      </View>
      <Button onPress={() => runMigrations()}>Run Migrations</Button>
      <Button
        onPress={() => {
          firebase.auth().signOut();
        }}
      >
        Sign out
      </Button>
    </Layout>
  );
}
