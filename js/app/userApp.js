import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
} from '@ui-kitten/components';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import {
  closeDatabaseConnection,
  openDatabaseConnection,
  runMigrations,
} from '../db';
import CurrentUserContext from './currentUserContext';
import Misc from './misc';
import Money from './money';
import Playground from './Playground';
import Tesla from './tesla';

function UiKittenBottomTabBar(props) {
  function onSelect(index) {
    props.navigation.navigate(props.state.routeNames[index]);
  }
  return (
    <SafeAreaView>
      <BottomNavigation selectedIndex={props.state.index} onSelect={onSelect}>
        <BottomNavigationTab
          icon={style => (
            <Icon {...style} width={30} height={30} name="shopping-cart" />
          )}
        />
        <BottomNavigationTab
          icon={style => (
            <Icon {...style} width={30} height={30} name="text-outline" />
          )}
        />
        <BottomNavigationTab
          icon={style => <Icon {...style} width={30} height={30} name="list" />}
        />
        <BottomNavigationTab
          icon={style => (
            <Icon {...style} width={30} height={30} name="settings" />
          )}
        />
      </BottomNavigation>
    </SafeAreaView>
  );
}

const Tab = createBottomTabNavigator();
export default function UserApp() {
  var currentUser = useContext(CurrentUserContext);
  var [isDbReady, setIsDbReady] = useState(false);
  useEffect(
    function() {
      openDatabaseConnection(currentUser.user.uid)
        .then(runMigrations)
        .then(function() {
          setIsDbReady(true);
        });
      return closeDatabaseConnection;
    },
    [currentUser.user.uid]
  );

  return isDbReady ? (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Money" tabBar={UiKittenBottomTabBar}>
        <Tab.Screen name="Money" component={Money} />
        <Tab.Screen name="Tesla" component={Tesla} />
        <Tab.Screen name="Misc" component={Misc} />
        <Tab.Screen name="Playground" component={Playground} />
      </Tab.Navigator>
    </NavigationContainer>
  ) : null;
}
