import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { createStackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Home from './home';
import MonthlyAnalytics from './monthlyAnalytics';
import MonthTransactions from './monthTransactions';
import { store, persistor } from './store';
import TransactionDetails from './transactionDetails';
import Accounts from './accounts';
import account from './account';

const MoneyStack = createStackNavigator({
  Home,
  TransactionDetails,
  MonthTransactions: {
    screen: MonthTransactions,
    navigationOptions: {
      title: new Date().toLocaleDateString('en-US', {
        month: 'long',
      }),
    },
  },
  MonthlyAnalytics: {
    screen: MonthlyAnalytics,
    navigationOptions: {
      title: 'Monthly Analytics',
    },
  },
  Accounts: {
    screen: Accounts,
    navigationOptions: {
      title: 'Accounts',
    },
  },
  Account: {
    screen: account,
    navigationOptions: {
      title: 'Account',
    },
  },
});

class Money extends React.Component {
  static router = MoneyStack.router;
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MoneyStack navigation={this.props.navigation} />
        </PersistGate>
      </Provider>
    );
  }
}

Money.navigationOptions = ({ navigation }) => ({
  tabBarIcon: ({ focused, horizontal, tintColor }) => {
    return (
      <Icon name="barschart" size={horizontal ? 20 : 25} color={tintColor} />
    );
  },
});

export default Money;
