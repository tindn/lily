import { AppRegistry, YellowBox } from 'react-native';
import App from './js/app';
import { openDatabaseConnection } from './js/db';

if (__DEV__) {
  YellowBox.ignoreWarnings(['Remote debugger']);
}

openDatabaseConnection();

AppRegistry.registerComponent('lily', () => App);
