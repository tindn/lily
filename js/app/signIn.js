import firebase from 'firebase';
import React from 'react';
import { FIREBASE_EMAIL, FIREBASE_PASSWORD } from 'react-native-dotenv';
import { Button, Layout } from 'react-native-ui-kitten';

export default function LoadingScreen() {
  return (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        onPress={() => {
          firebase
            .auth()
            .signInWithEmailAndPassword(FIREBASE_EMAIL, FIREBASE_PASSWORD)
            .catch(console.log);
        }}
      >
        Sign In
      </Button>
    </Layout>
  );
}
