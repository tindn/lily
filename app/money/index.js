import React from 'react';
import { Button, Icon } from 'react-native-elements';
import Screen from '../screen';

function Money() {
  return (
    <Screen>
      <Button title="hey" />
    </Screen>
  );
}

Money.navigationOptions = ({ navigation }) => ({
  tabBarIcon: ({ focused, horizontal, tintColor }) => {
    return (
      <Icon name="timeline" size={horizontal ? 20 : 25} color={tintColor} />
    );
  }
});

export default Money;
