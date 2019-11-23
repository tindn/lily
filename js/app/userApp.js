import React, { useContext, useEffect } from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import theme from '../theme';
import Contact from './contact';
import Misc from './misc';
import Money from './money';
import Playground from './Playground';
import CurrentUserContext from './currentUserContext';
import { openDatabaseConnection } from '../db';

const TabNavigator = createBottomTabNavigator(
  {
    Money,
    Misc,
    Contact,
    Playground,
  },
  {
    initialRouteName: 'Playground',
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
  useEffect(
    function() {
      console.log('opening database for', currentUser.user.uid);
      openDatabaseConnection(currentUser.user.uid);
    },
    [currentUser.user.uid]
  );

  return <TabNavigator navigation={props.navigation} />;
}

UserApp.router = TabNavigator.router;
