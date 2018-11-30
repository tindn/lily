import React from 'react';
import { ThemeProvider } from 'react-native-elements';
import { createAppContainer, createBottomTabNavigator } from 'react-navigation';
import customTheme from '../customTheme.json';
import Money from './money';
import Settings from './settings';

const TabNavigator = createBottomTabNavigator(
  {
    Money,
    Settings
  },
  {
    tabBarOptions: {
      activeTintColor: customTheme.colors.primary,
      inactiveTintColor: 'gray'
    }
  }
);

const App = createAppContainer(TabNavigator);

export default () => (
  <ThemeProvider theme={customTheme}>
    <App />
  </ThemeProvider>
);
