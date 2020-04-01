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
import Contact from './contact';
import CurrentUserContext from './currentUserContext';
import Misc from './misc';
import Money from './money';
import Playground from './Playground';

function UiKittenBottomTabBar(props) {
  function onSelect(index) {
    props.navigation.navigate(props.state.routeNames[index]);
  }
  return (
    <SafeAreaView>
      <BottomNavigation selectedIndex={props.state.index} onSelect={onSelect}>
        <BottomNavigationTab
          icon={style => (
            <Icon {...style} width={30} height={30} name="credit-card" />
          )}
        />
        <BottomNavigationTab
          icon={style => <Icon {...style} width={30} height={30} name="list" />}
        />
        <BottomNavigationTab
          icon={style => (
            <Icon {...style} width={30} height={30} name="person" />
          )}
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
      return function() {
        closeDatabaseConnection();
      };
    },
    [currentUser.user.uid]
  );

  return isDbReady ? (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Money" tabBar={UiKittenBottomTabBar}>
        <Tab.Screen
          name="Money"
          component={Money}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="barschart" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Misc"
          component={Misc}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="edit" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Contact"
          component={Contact}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="user" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Playground"
          component={Playground}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="setting" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  ) : null;
}
