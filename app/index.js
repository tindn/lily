import firebase from 'firebase';
import { createAppContainer, createBottomTabNavigator } from 'react-navigation';
import config from '../config.json';
import theme from '../theme.json';
import Money from './money';
import Settings from './settings';
import { AsyncStorage } from 'react-native';
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

firebase.firestore().settings({
  timestampsInSnapshots: true
});
const TabNavigator = createBottomTabNavigator(
  {
    Money,
    Settings
  },
  {
    tabBarOptions: {
      activeTintColor: theme.colors.primary,
      inactiveTintColor: 'gray'
    }
  }
);

const App = createAppContainer(TabNavigator);

export default App;
