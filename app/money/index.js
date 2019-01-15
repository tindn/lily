import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { createStackNavigator } from 'react-navigation';
import Expenses from './expenses';
import TransactionDetails from './transactionDetails';
import MonthTransactions from './monthTransactions';
import MonthlyAnalytics from './monthlyAnalytics';

const MoneyStack = createStackNavigator({
  Expenses,
  TransactionDetails,
  MonthTransactions,
  MonthlyAnalytics,
});

class Money extends React.Component {
  static router = MoneyStack.router;
  render() {
    return <MoneyStack navigation={this.props.navigation} />;
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
