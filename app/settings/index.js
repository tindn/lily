import React from 'react';
import Screen from '../screen';
import Icon from 'react-native-vector-icons/AntDesign';

function Settings() {
  return <Screen style={{ flex: 1, justifyContent: 'center' }} />;
}

Settings.navigationOptions = ({ navigation }) => ({
  tabBarIcon: ({ horizontal, tintColor }) => {
    return (
      <Icon name="setting" size={horizontal ? 20 : 25} color={tintColor} />
    );
  }
});

export default Settings;
