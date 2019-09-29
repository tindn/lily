import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { createStackNavigator } from 'react-navigation-stack';
import ElectricityReadingsList from './electricityReadingsList';
import Home from './home';
import LargeDisplay from './largeDisplay';

const MiscStack = createStackNavigator({
  Home,
  ElectricityReadingsList,
  LargeDisplay,
});

class Misc extends React.Component {
  static router = MiscStack.router;

  render() {
    return <MiscStack navigation={this.props.navigation} />;
  }
}

Misc.navigationOptions = () => ({
  // eslint-disable-next-line react/display-name
  tabBarIcon: ({ horizontal, tintColor }) => {
    return <Icon name="edit" size={horizontal ? 20 : 25} color={tintColor} />;
  },
});

export default Misc;
