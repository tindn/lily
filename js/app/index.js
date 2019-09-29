import firebase from 'firebase';
import 'firebase/firestore';
import React from 'react';
import { AsyncStorage } from 'react-native';
import 'react-native-gesture-handler';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import config from '../../config.json';
import theme from '../theme';
import Contact from './contact';
import Misc from './misc';
import Money from './money';
import { persistor, store } from '../store';

firebase.initializeApp(config.firebase);
firebase
  .auth()
  .signInWithEmailAndPassword(
    config.firebaseAccount.email,
    config.firebaseAccount.password
  )
  .catch(function(error) {
    AsyncStorage.setItem('lily-firebase-init-error', JSON.stringify(error));
  });

firebase.firestore();

const TabNavigator = createBottomTabNavigator(
  {
    Money,
    Misc,
    Contact,
  },
  {
    defaultNavigationOptions: {
      tabBarLabel: () => null,
    },
    tabBarOptions: {
      activeTintColor: theme.colors.primary,
      inactiveTintColor: 'gray',
    },
  }
);

const AppContainer = createAppContainer(TabNavigator);

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppContainer />
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
