import React from 'react';
import { ImageBackground, StatusBar } from 'react-native';

export default function LoadingScreen() {
  return (
    <ImageBackground
      source={require('../../images/loading.jpeg')}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}
    >
      <StatusBar barStyle="light-content" />
    </ImageBackground>
  );
}
