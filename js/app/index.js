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
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { setRef } from '../log';
import { persistor, store } from '../redux';
import CurrentUserContext from './currentUserContext';
import SignInScreen from './SignIn';
import UserApp from './UserApp';

firebase.initializeApp({
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  projectId: FIREBASE_PROJECT_ID,
});

firebase.firestore();

function App() {
  var [currentUser, setCurrentUser] = useState();

  useEffect(function () {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CurrentUserContext.Provider
          value={{ user: currentUser, setCurrentUser }}
        >
          {currentUser === undefined ? null : currentUser === null ? (
            <SignInScreen />
          ) : (
            <UserApp />
          )}
        </CurrentUserContext.Provider>
        <DropdownAlert ref={(ref) => setRef(ref)} />
      </PersistGate>
    </Provider>
  );
}

export default App;
