import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import { Button, ThemeProvider, withTheme } from 'react-native-elements';
import customTheme from './customTheme.json';

class App extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button title="hey" />
      </View>
    );
  }
}

export default () => (
  <ThemeProvider theme={customTheme}>
    <App />
  </ThemeProvider>
);
