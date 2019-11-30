import { light, mapping } from '@eva-design/eva';
import firebase from 'firebase';
import 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_PROJECT_ID,
} from 'react-native-dotenv';
import DropdownAlert from 'react-native-dropdownalert';
import 'react-native-gesture-handler';
import { ApplicationProvider } from 'react-native-ui-kitten';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { setRef } from '../log';
import { persistor, store } from '../redux';
import CurrentUserContext from './currentUserContext';
import LoadingScreen from './loading';
import navigation from './navigation';
import SignInScreen from './signIn';
import UserApp from './userApp';

firebase.initializeApp({
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  projectId: FIREBASE_PROJECT_ID,
});

var AppRoutes = createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      UserApp: UserApp,
      SignIn: SignInScreen,
    },
    {
      initialRouteName: 'Loading',
    }
  )
);

firebase.firestore();

function App() {
  var [currentUser, setCurrentUser] = useState();

  useEffect(function() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        setCurrentUser(user);
        navigation.navigate('UserApp');
      } else {
        navigation.navigate('SignIn');
      }
    });
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApplicationProvider mapping={mapping} theme={light}>
          <CurrentUserContext.Provider
            value={{ user: currentUser, setCurrentUser }}
          >
            <AppRoutes
              ref={navigatorRef => {
                navigation.setTopLevelNavigator(navigatorRef);
              }}
            />
          </CurrentUserContext.Provider>
        </ApplicationProvider>
        <DropdownAlert ref={ref => setRef(ref)} />
      </PersistGate>
    </Provider>
  );
}

export default App;
