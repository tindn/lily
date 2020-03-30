import React from 'react';
import { Image } from 'react-native';
import Screen from '../../components/screen';

export default function Contact() {
  return (
    <Screen style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        // eslint-disable-next-line no-undef
        source={require('./contact.png')}
        style={{ width: 320, height: 320 }}
      />
    </Screen>
  );
}
