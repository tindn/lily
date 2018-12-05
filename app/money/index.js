import React from 'react';
import { ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Screen from '../screen';
import TransactionForm from './transactionForm';
import TransactionList from './transactionList';
import SpendTracking from './spendTracking';

function Money() {
  return (
    <Screen>
      <ScrollView>
        <TransactionForm />
        <SpendTracking />
        <TransactionList />
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
