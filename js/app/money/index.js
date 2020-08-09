import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Drawer as UIKittenDrawer } from '@ui-kitten/components';
import { Menu, Plus } from 'components/Icons';
import { format } from 'date-fns';
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
import VendorDetails from './vendors/VendorDetails';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const drawerContentItems = [
  { title: 'Home', route: 'Home' },
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
          onSelect={(index) => {
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
  const currentMonth = format(new Date(), 'LLLL');
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: currentMonth,
          ...headerStyles,
          headerLeft: () => (
            <TouchableOpacity onPress={props.navigation.toggleDrawer}>
              <Menu
                width={25}
                height={25}
                color="#3366FF"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
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
        name="MonthlyAnalytics"
        component={MonthlyAnalytics}
        options={{ title: 'Monthly Analytics', ...headerStyles }}
      />
      <Stack.Screen
        name="AccountDetails"
        component={AccountDetails}
        options={({ route }) => ({
          title: route.params.accountName || 'Account Details',
          ...headerStyles,
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
              <Plus width={25} height={25} color="#3366FF" />
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
