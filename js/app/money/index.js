import { createStackNavigator } from '@react-navigation/stack';
import { format } from 'date-fns';
import React from 'react';
import theme from '../../theme';
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
          if (route.params && route.params.category) {
            title = route.params.category;
          }
          return {
            title,
            ...headerStyles,
          };
        }}
      />
      <Stack.Screen
        name='MonthlyAnalytics'
        component={MonthlyAnalytics}
        options={{ title: 'Monthly Analytics', ...headerStyles }}
      />
    </Stack.Navigator>
  );
}
