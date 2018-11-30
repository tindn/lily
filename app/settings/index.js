import React from 'react';
import { View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import Screen from '../screen';

function Settings() {
  return (
    <Screen style={{ flex: 1, justifyContent: 'center' }}>
      <Button title="hey" />
    </Screen>
  );
}

Settings.navigationOptions = ({ navigation }) => ({
  tabBarIcon: ({ focused, horizontal, tintColor }) => {
    return (
      <Icon name="settings" size={horizontal ? 20 : 25} color={tintColor} />
    );
  }
});

export default Settings;
