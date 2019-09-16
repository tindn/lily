import firebase from 'firebase';
import 'firebase/firestore';
import { AsyncStorage } from 'react-native';
import { createAppContainer, createBottomTabNavigator } from 'react-navigation';
import config from '../config.json';
import theme from '../theme';
import Contact from './contact';
import Misc from './misc';
import Money from './money';

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

const App = createAppContainer(TabNavigator);

export default App;
