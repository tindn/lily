import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  closeDatabaseConnection,
  openDatabaseConnection,
  runMigrations,
} from '../db';
import theme from '../theme';
import Contact from './contact';
import CurrentUserContext from './currentUserContext';
import Misc from './misc';
import Money from './money';
import Playground from './Playground';

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
      <Tab.Navigator
        initialRouteName="Money"
        tabBarOptions={{
          activeTintColor: theme.colors.primary,
          inactiveTintColor: 'gray',
        }}
        screenOptions={() => ({
          tabBarLabel: () => null,
        })}
      >
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

// UserApp.router = TabNavigator.router;
