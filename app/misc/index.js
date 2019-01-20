import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { createStackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Home from './home';
import ElectricityReadingsList from './electricityReadingsList';
import { persistor, store } from './store';
import ElectricityReadingAdd from './electricityReadingAdd';

const MiscStack = createStackNavigator({
  Home,
  ElectricityReadingsList: {
    screen: ElectricityReadingsList,
    navigationOptions: {
      title: 'Readings',
      headerRight: <ElectricityReadingAdd />,
    },
  },
});

class Misc extends React.Component {
  static router = MiscStack.router;

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MiscStack navigation={this.props.navigation} />
        </PersistGate>
      </Provider>
    );
  }
}

Misc.navigationOptions = ({ navigation }) => ({
  tabBarIcon: ({ focused, horizontal, tintColor }) => {
    return <Icon name="edit" size={horizontal ? 20 : 25} color={tintColor} />;
  },
});

export default Misc;
