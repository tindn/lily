import { AppRegistry, YellowBox } from 'react-native';
import App from './js/app';

if (__DEV__) {
  YellowBox.ignoreWarnings(['Remote debugger']);
}

AppRegistry.registerComponent('lily', () => App);
