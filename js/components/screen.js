import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import theme from '../theme';

function Screen(props) {
  StatusBar.setBarStyle(props.statusBarStyle || 'dark-content');
  return (
    <SafeAreaView
      style={[
        { flex: 1, backgroundColor: theme.colors.backgroundColor },
        props.style,
      ]}
    >
      {props.children}
    </SafeAreaView>
  );
}

export default Screen;
