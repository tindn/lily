/** @format */
import { YellowBox } from 'react-native';
if (__DEV__) {
  YellowBox.ignoreWarnings(['Remote debugger']);
}
import { AppRegistry } from 'react-native';
import App from './app';

AppRegistry.registerComponent('lily', () => App);
