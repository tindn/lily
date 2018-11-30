import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';

function Screen(props) {
  return (
    <SafeAreaView style={[{ flex: 1 }, props.style]}>
      <StatusBar style={props.statusBarStyle} />
      {props.children}
    </SafeAreaView>
  );
}

export default Screen;
