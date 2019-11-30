import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { createStackNavigator } from 'react-navigation-stack';
import AccountDetails from './financeOverview/accountDetails';
import FinanceOverview from './financeOverview';
import Home from './home';
import MonthlyAnalytics from './monthlyAnalytics';
import MonthTransactions from './monthTransactions';
import SnapshotList from './financeOverview/snapshotList';
import TransactionDetails from './transactionDetails';
import VendorDetails from './vendors/vendorDetails';
import Vendors from './vendors';
import Categories from './categories';

const MoneyStack = createStackNavigator({
  Home,
  TransactionDetails,
  MonthTransactions,
  MonthlyAnalytics,
  AccountDetails,
  Vendors,
  VendorDetails,
  SnapshotList,
  FinanceOverview,
  Categories,
});

class Money extends React.Component {
  static router = MoneyStack.router;
  render() {
    return <MoneyStack navigation={this.props.navigation} />;
  }
}

Money.navigationOptions = () => ({
  // eslint-disable-next-line react/display-name
  tabBarIcon: ({ horizontal, tintColor }) => {
    return (
      <Icon name="barschart" size={horizontal ? 20 : 25} color={tintColor} />
    );
  },
});

export default Money;
