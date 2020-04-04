import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ElectricityReadingsList from './electricityReadingsList';
import Home from './home';
import LargeDisplay from './largeDisplay';
import { useHeadStyles } from '../../uiKittenTheme';

const Stack = createStackNavigator();
export default function Misc() {
  const headerStyles = useHeadStyles();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="ElectricityReadingsList"
        component={ElectricityReadingsList}
        options={{ title: 'Readings', ...headerStyles }}
      />
      <Stack.Screen
        name="LargeDisplay"
        component={LargeDisplay}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}
