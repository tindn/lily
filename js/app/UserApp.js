import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import {
  Settings as SettingsIcon,
  ShoppingCart,
  FinanceOverview as FinanceOverviewIcon,
} from 'components/Icons';
import React, { useContext, useEffect, useState } from 'react';
import { View, SafeAreaView, TouchableOpacity } from 'react-native';
import {
  closeDatabaseConnection,
  openDatabaseConnection,
  runMigrations,
} from '../db';
import theme from '../theme';
import CurrentUserContext from './currentUserContext';
import Money from './money';
import FinanceOverview from './financeOverview';
import Settings from './settings';

function UiKittenBottomTabBar(props) {
  return (
    <View
      style={{
        backgroundColor: theme.colors.layerOne,
      }}
      selectedIndex={props.state.index}
    >
      <SafeAreaView
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}
      >
        <TouchableOpacity
          style={{ paddingTop: 20 }}
          onPress={() => {
            props.navigation.navigate(props.state.routeNames[0]);
          }}
        >
          <ShoppingCart
            width={30}
            height={30}
            color={
              props.state.index === 0
                ? theme.colors.primary
                : theme.colors.darkerGray
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ paddingTop: 20 }}
          onPress={() => {
            props.navigation.navigate(props.state.routeNames[1]);
          }}
        >
          <FinanceOverviewIcon
            width={30}
            height={30}
            color={
              props.state.index === 1
                ? theme.colors.primary
                : theme.colors.darkerGray
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ paddingTop: 20 }}
          onPress={() => {
            props.navigation.navigate(props.state.routeNames[2]);
          }}
        >
          <SettingsIcon
            width={30}
            height={30}
            color={
              props.state.index === 2
                ? theme.colors.primary
                : theme.colors.darkerGray
            }
          />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const Tab = createBottomTabNavigator();
export default function UserApp() {
  var currentUser = useContext(CurrentUserContext);
  var [isDbReady, setIsDbReady] = useState(false);
  useEffect(
    function () {
      openDatabaseConnection(currentUser.user.uid)
        .then(runMigrations)
        .then(function () {
          setIsDbReady(true);
        });
      return closeDatabaseConnection;
    },
    [currentUser.user.uid]
  );

  return isDbReady ? (
    <NavigationContainer>
      <Tab.Navigator initialRouteName='Money' tabBar={UiKittenBottomTabBar}>
        <Tab.Screen name='Money' component={Money} />
        <Tab.Screen name='FinanceOverview' component={FinanceOverview} />
        <Tab.Screen name='Settings' component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  ) : null;
}
