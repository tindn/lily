import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import theme from '../../theme';
import AccountDetails from './accountDetails';
import Home from './home';
import SnapshotList from './snapshotList';

const Stack = createStackNavigator();

export default FinanceOverviewStack;

function FinanceOverviewStack() {
  const headerStyles = {
    headerStyle: {
      backgroundColor: theme.colors.layerOne,
    },
    headerTitleStyle: { color: theme.colors.white },
  };
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Home'
        component={Home}
        options={{ title: 'Overview', ...headerStyles }}
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
    </Stack.Navigator>
  );
}
