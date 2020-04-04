import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Drawer as UIKittenDrawer, Icon } from '@ui-kitten/components';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Screen from '../../components/screen';
import { useHeadStyles } from '../../uiKittenTheme';
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
const Drawer = createDrawerNavigator();

const drawerContentItems = [
  { title: 'Home', route: 'Home' },
  { title: 'Transactions', route: 'MonthTransactions' },
  { title: 'Past Months', route: 'MonthlyAnalytics' },
  { title: 'Vendors', route: 'Vendors' },
  { title: 'Categories', route: 'Categories' },
  { title: 'Overview', route: 'FinanceOverview' },
];

function DrawerContent({ navigation, state }) {
  return (
    <Screen>
      <View style={{ marginTop: 10 }}>
        <UIKittenDrawer
          data={drawerContentItems}
          selectedIndex={state.index}
          onSelect={index => {
            navigation.navigate(drawerContentItems[index].route);
          }}
        />
      </View>
    </Screen>
  );
}

export default function Money() {
  return (
    <Drawer.Navigator drawerContent={DrawerContent}>
      <Drawer.Screen name="April" component={MoneyStack} />
    </Drawer.Navigator>
  );
}

function MoneyStack(props) {
  const headerStyles = useHeadStyles();
  const currentMonth = new Date().toLocaleString('en-US', {
    month: 'long',
  });
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: currentMonth,
          ...headerStyles,
          headerLeft: () => (
            <Icon
              name="menu-outline"
              width={25}
              height={25}
              fill="#3366FF"
              onPress={props.navigation.toggleDrawer}
              style={{ marginLeft: 10 }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="TransactionDetails"
        component={TransactionDetails}
        options={{
          title: 'Details',
          ...headerStyles,
        }}
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
          ...headerStyles,
        })}
      />
      <Stack.Screen
        name="MonthlyAnalytics"
        component={MonthlyAnalytics}
        options={{ title: 'Monthly Analytics', ...headerStyles }}
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
              <Icon name="plus-outline" width={25} height={25} fill="#3366FF" />
            </TouchableOpacity>
          ),
          ...headerStyles,
        })}
      />
      <Stack.Screen
        name="VendorDetails"
        component={VendorDetails}
        options={({ route }) => ({
          title: ((route.params || {}).vendor || { name: 'New Vendor' }).name,
          ...headerStyles,
        })}
      />
      <Stack.Screen
        name="SnapshotList"
        component={SnapshotList}
        options={{ title: 'Snapshots', ...headerStyles }}
      />
      <Stack.Screen
        name="FinanceOverview"
        component={FinanceOverview}
        options={{ title: 'Overview', ...headerStyles }}
      />
      <Stack.Screen
        name="Categories"
        component={Categories}
        options={headerStyles}
      />
    </Stack.Navigator>
  );
}
