import React from 'react';
import { ScrollView, TextInput, View, Button } from 'react-native';
import Screen from '../screen';
import Icon from 'react-native-vector-icons/AntDesign';
function Money() {
  return (
    <Screen>
      <ScrollView>
        <View>
          <View style={{ flexDirection: 'row' }}>
            <TextInput placeholder="Nov 20, 2018" keyboardType="number-pad" />
            <TextInput placeholder="00.00" keyboardType="number-pad" />
          </View>
          <View>
            <TextInput placeholder="Memo" />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

Money.navigationOptions = ({ navigation }) => ({
  tabBarIcon: ({ focused, horizontal, tintColor }) => {
    return (
      <Icon name="barschart" size={horizontal ? 20 : 25} color={tintColor} />
    );
  }
});

export default Money;
