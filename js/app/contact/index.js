import React from 'react';
import { Image } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Screen from '../../components/screen';

function Contact() {
  return (
    <Screen style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        // eslint-disable-next-line no-undef
        source={require('./contact.png')}
        style={{ width: 320, height: 320 }}
      />
    </Screen>
  );
}

Contact.navigationOptions = () => ({
  // eslint-disable-next-line react/display-name
  tabBarIcon: ({ horizontal, tintColor }) => {
    return <Icon name="user" size={horizontal ? 20 : 25} color={tintColor} />;
  },
});

export default Contact;
