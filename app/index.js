import firebase from 'firebase';
import { createAppContainer, createBottomTabNavigator } from 'react-navigation';
import config from '../config.json';
import theme from '../theme';
import Money from './money';
import Misc from './misc';
import Contact from './contact';
import { AsyncStorage } from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';

require('firebase/firestore');
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

KeyboardManager.setToolbarPreviousNextButtonEnable(true);

const TabNavigator = createBottomTabNavigator(
  {
    Money,
    Misc,
    Contact,
  },
  {
    tabBarOptions: {
      activeTintColor: theme.colors.primary,
      inactiveTintColor: 'gray',
    },
  }
);

const App = createAppContainer(TabNavigator);

export default App;
