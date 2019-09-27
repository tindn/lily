import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { createStackNavigator } from 'react-navigation';
import AccountDetails from './accountDetails';
import Accounts from './accounts';
import FinanceOverview from './financeOverview';
import Home from './home';
import MonthlyAnalytics from './monthlyAnalytics';
import MonthSetup from './monthSetup';
import MonthTransactions from './monthTransactions';
import SnapshotList from './snapshotList';
import TransactionDetails from './transactionDetails';
import VendorDetails from './vendorDetails';
import Vendors from './vendors';

const MoneyStack = createStackNavigator({
  Home,
  TransactionDetails,
  MonthTransactions,
  MonthlyAnalytics,
  Accounts,
  AccountDetails,
  Vendors,
  VendorDetails,
  SnapshotList,
  FinanceOverview,
  MonthSetup,
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
