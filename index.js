import { AppRegistry } from 'react-native';
import App from './js/app';

if (__DEV__) {
  require('./js/reactotron');
}

AppRegistry.registerComponent('lily', () => App);
