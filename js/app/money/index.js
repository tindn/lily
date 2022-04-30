import { createStackNavigator } from '@react-navigation/stack';
import { format } from 'date-fns';
import React from 'react';
import theme from '../../theme';
import FinanceOverview from './financeOverview';
import AccountDetails from './financeOverview/accountDetails';
import SnapshotList from './financeOverview/snapshotList';
import Home from './home';
import MonthlyAnalytics from './MonthlyAnalytics';
import MonthTransactions from './MonthTransactions';
import TransactionDetails from './TransactionDetails';

const Stack = createStackNavigator();

export default MoneyStack;

function MoneyStack() {
  const headerStyles = {
    headerStyle: {
      backgroundColor: theme.colors.layerOne,
    },
    headerTitleStyle: { color: theme.colors.white },
  };
  const currentMonth = format(new Date(), 'LLLL');
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Home'
        component={Home}
        options={{
          title: currentMonth,
          ...headerStyles,
        }}
      />
      <Stack.Screen
        name='TransactionDetails'
        component={TransactionDetails}
        options={{
          title: 'Details',
          ...headerStyles,
        }}
      />
      <Stack.Screen
        name='MonthTransactions'
        component={MonthTransactions}
        options={({ route }) => {
          var title = '';
          if (route.params && route.params.date) {
            title = format(route.params.date, 'LLLL y');
          }
          return {
            title: title,
            ...headerStyles,
          };
        }}
      />
      <Stack.Screen
        name='MonthlyAnalytics'
        component={MonthlyAnalytics}
        options={{ title: 'Monthly Analytics', ...headerStyles }}
      />
      <Stack.Screen
        name='AccountDetails'
        component={AccountDetails}
        options={({ route }) => ({
          title: route.params.accountName || 'Account Details',
          ...headerStyles,
        })}
      />
      <Stack.Screen
        name='SnapshotList'
        component={SnapshotList}
        options={{ title: 'Snapshots', ...headerStyles }}
      />
      <Stack.Screen
        name='FinanceOverview'
        component={FinanceOverview}
        options={{ title: 'Overview', ...headerStyles }}
      />
    </Stack.Navigator>
  );
}
