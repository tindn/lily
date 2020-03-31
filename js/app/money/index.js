import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import theme from '../../theme';
import Categories from './categories';
import FinanceOverview from './financeOverview';
import AccountDetails from './financeOverview/accountDetails';
import SnapshotList from './financeOverview/snapshotList';
import Home from './home';
import MonthlyAnalytics from './MonthlyAnalytics';
import MonthTransactions from './MonthTransactions';
import TransactionDetails from './TransactionDetails';
import Vendors from './vendors';
import VendorDetails from './vendors/vendorDetails';

const Stack = createStackNavigator();

export default function Money() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="TransactionDetails"
        component={TransactionDetails}
        options={{ title: 'Details' }}
      />
      <Stack.Screen
        name="MonthTransactions"
        component={MonthTransactions}
        options={({ route }) => ({
          title: ((route.params || {}).date || new Date()).toLocaleDateString(
            'en-US',
            {
              month: 'long',
            }
          ),
        })}
      />
      <Stack.Screen
        name="MonthlyAnalytics"
        component={MonthlyAnalytics}
        options={{ title: 'Monthly Analytics' }}
      />
      <Stack.Screen
        name="AccountDetails"
        component={AccountDetails}
        options={({ route }) => ({
          title: route.params.accountName || 'Account Details',
        })}
      />
      <Stack.Screen
        name="Vendors"
        component={Vendors}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('VendorDetails', {})}
              style={{ marginRight: 10 }}
            >
              <Icon name="plus" size={25} color={theme.colors.iosBlue} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="VendorDetails"
        component={VendorDetails}
        options={({ route }) => ({
          title: ((route.params || {}).vendor || { name: 'New Vendor' }).name,
        })}
      />
      <Stack.Screen
        name="SnapshotList"
        component={SnapshotList}
        options={{ title: 'Snapshots' }}
      />
      <Stack.Screen
        name="FinanceOverview"
        component={FinanceOverview}
        options={{ title: 'Overview' }}
      />
      <Stack.Screen name="Categories" component={Categories} />
    </Stack.Navigator>
  );
}
