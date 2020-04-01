import { AppRegistry, YellowBox } from 'react-native';
import App from './js/app';

require('react-native').unstable_enableLogBox();
console.disableLogBox = true;
if (__DEV__) {
  YellowBox.ignoreWarnings(['Remote debugger']);
}

AppRegistry.registerComponent('lily', () => App);
