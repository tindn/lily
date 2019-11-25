import React, { useContext, useEffect, useState } from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import theme from '../theme';
import Contact from './contact';
import Misc from './misc';
import Money from './money';
import Playground from './Playground';
import CurrentUserContext from './currentUserContext';
import {
  openDatabaseConnection,
  closeDatabaseConnection,
  runMigrations,
} from '../db';

const TabNavigator = createBottomTabNavigator(
  {
    Money,
    Misc,
    Contact,
    Playground,
  },
  {
    initialRouteName: 'Money',
    defaultNavigationOptions: {
      tabBarLabel: () => null,
    },
    tabBarOptions: {
      activeTintColor: theme.colors.primary,
      inactiveTintColor: 'gray',
    },
  }
);

export default function UserApp(props) {
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

  return isDbReady ? <TabNavigator navigation={props.navigation} /> : null;
}

UserApp.router = TabNavigator.router;
