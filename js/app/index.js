import firebase from 'firebase';
import 'firebase/firestore';
import React from 'react';
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_EMAIL,
  FIREBASE_PASSWORD,
} from 'react-native-dotenv';
import 'react-native-gesture-handler';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../store';
import theme from '../theme';
import Contact from './contact';
import Misc from './misc';
import Money from './money';

firebase.initializeApp({
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  projectId: FIREBASE_PROJECT_ID,
});
firebase
  .auth()
  .signInWithEmailAndPassword(FIREBASE_EMAIL, FIREBASE_PASSWORD)
  .catch(console.log);

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
