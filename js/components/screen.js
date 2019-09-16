import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import theme from '../theme';

function Screen(props) {
  return (
    <SafeAreaView
      style={[
        { flex: 1, backgroundColor: theme.colors.backgroundColor },
        props.style,
      ]}
    >
      <StatusBar style={props.statusBarStyle} />
      {props.children}
    </SafeAreaView>
  );
}

export default Screen;
