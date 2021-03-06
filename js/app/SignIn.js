import { Button, Text, Input } from 'components';
import firebase from 'firebase';
import React, { useState } from 'react';
import { ImageBackground, View } from 'react-native';
import Screen from '../components/screen';
import { useToggle } from '../hooks';

export default function SignIn() {
  var [email, setEmail] = useState('');
  var [password, setPassword] = useState('');
  var [errorMessage, setErrorMessage] = useState('');
  var [hidePassword, toggleHidePassword] = useToggle(true);

  return (
    <Screen
      isFullScreen
      lightModeStatusBar="light-content"
      darkModeStatusBar="light-content"
    >
      <View
        style={{
          backgroundColor: '#3366FF',
          minHeight: 216,
        }}
      >
        <ImageBackground
          // eslint-disable-next-line no-undef
          source={require('../../images/signIn.jpeg')}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <Text
            style={{
              color: 'white',
              fontWeight: 'normal',
            }}
            category="h1"
          >
            Meowww
          </Text>
          <Text
            category="h6"
            style={{
              marginTop: 16,
              color: 'white',
              fontWeight: 'normal',
            }}
          >
            Sign in to your account
          </Text>
        </ImageBackground>
      </View>
      <View style={{ flex: 1, marginTop: 32, paddingHorizontal: 16 }}>
        <Input
          autoCapitalize="none"
          textStyle={{
            fontWeight: 'normal',
          }}
          placeholder="Email"
          onChangeText={setEmail}
        />
        <Input
          autoCapitalize="none"
          style={{
            marginTop: 16,
          }}
          placeholder="Password"
          secureTextEntry={hidePassword}
          onChangeText={setPassword}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button
            textStyle={{
              fontSize: 15,
            }}
            onPress={toggleHidePassword}
          >
            {hidePassword ? 'Show' : 'Hide'} password
          </Button>
        </View>
        <Text status="danger">{errorMessage}</Text>
      </View>
      <Button
        style={{ marginHorizontal: 40, marginBottom: 20 }}
        onPress={function () {
          firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(function () {
              setEmail('');
              setPassword('');
              setErrorMessage('');
            })
            .catch(function (e) {
              setErrorMessage(e.message);
            });
        }}
        disabled={!email || !password}
      >
        SIGN IN
      </Button>
    </Screen>
  );
}
