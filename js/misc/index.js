import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { createStackNavigator } from 'react-navigation';
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

Misc.navigationOptions = ({ navigation }) => ({
  tabBarIcon: ({ focused, horizontal, tintColor }) => {
    return <Icon name="edit" size={horizontal ? 20 : 25} color={tintColor} />;
  },
});

export default Misc;
