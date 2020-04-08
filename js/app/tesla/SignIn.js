import { Button, Input, Text } from '@ui-kitten/components';
import React, { useState } from 'react';
import { View } from 'react-native';
import { TESLA_LOGIN_EMAIL, TESLA_LOGIN_PASSWORD } from 'react-native-dotenv';
import { useToggle } from '../../hooks';

export default function SignIn(props) {
  var [email, setEmail] = useState(TESLA_LOGIN_EMAIL);
  var [password, setPassword] = useState(TESLA_LOGIN_PASSWORD);
  var [errorMessage, setErrorMessage] = useState('');
  var [hidePassword, toggleHidePassword] = useToggle(true);
  return (
    <View style={{ marginVertical: 20, marginHorizontal: 10 }}>
      <Input
        autoCapitalize="none"
        textStyle={{
          fontWeight: 'normal',
        }}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <Input
        autoCapitalize="none"
        value={password}
        style={{
          marginTop: 16,
        }}
        textStyle={{
          fontWeight: 'normal',
        }}
        placeholder="Password"
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
      <View
        style={{
          marginTop: 20,
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}
      >
        <Button
          status="basic"
          onPress={() => {
            setEmail('');
            setPassword('');
            setErrorMessage('');
          }}
        >
          Clear
        </Button>
        <Button
          onPress={() => {
            props.onLogin(email, password).catch(error => {
              setErrorMessage(error.error);
            });
          }}
        >
          Login
        </Button>
      </View>
    </View>
  );
}
