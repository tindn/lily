import React, { useState } from 'react';
import { ImageBackground, StatusBar, View } from 'react-native';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import firebase from 'firebase';
import { useToggle } from '../hooks';

export default function LoadingScreen() {
  var [email, setEmail] = useState('');
  var [password, setPassword] = useState('');
  var [errorMessage, setErrorMessage] = useState('');
  var [hidePassword, toggleHidePassword] = useToggle(true);

  StatusBar.setBarStyle('light-content');
  return (
    <Layout style={{ flex: 1 }}>
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
          textStyle={{
            fontWeight: 'normal',
          }}
          placeholder="Password"
          // icon={() => <Icon style={{}} name="eye-off" />}
          secureTextEntry={hidePassword}
          onChangeText={setPassword}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button
            style={{
              paddingHorizontal: 0,
            }}
            textStyle={{
              fontSize: 15,
              color: '#8F9BB3',
              fontWeight: 'normal',
            }}
            appearance="ghost"
            activeOpacity={0.75}
            onPress={toggleHidePassword}
          >
            {hidePassword ? 'Show' : 'Hide'} password
          </Button>
        </View>
        <Text status="danger">{errorMessage}</Text>
      </View>
      <Button
        style={{ marginHorizontal: 40, marginBottom: 20 }}
        size="large"
        onPress={function() {
          firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(function() {
              setEmail('');
              setPassword('');
              setErrorMessage('');
            })
            .catch(function(e) {
              setErrorMessage(e.message);
            });
        }}
        disabled={!email || !password}
      >
        SIGN IN
      </Button>
    </Layout>
  );
}
