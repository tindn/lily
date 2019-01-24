import React from 'react';
import { Image, View } from 'react-native';
import Screen from '../screen';
import Icon from 'react-native-vector-icons/AntDesign';

function Contact() {
  return (
    <Screen style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={require('./contact.png')}
        style={{ width: 320, height: 320 }}
      />
    </Screen>
  );
}

Contact.navigationOptions = ({ navigation }) => ({
  tabBarIcon: ({ horizontal, tintColor }) => {
    return <Icon name="user" size={horizontal ? 20 : 25} color={tintColor} />;
  },
});

export default Contact;
