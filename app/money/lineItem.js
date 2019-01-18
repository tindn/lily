import React from 'react';
import { Text, View } from 'react-native';
import MoneyDisplay from '../moneyDisplay';

function LineItem(props) {
  let { text, amount, style, textStyle, negative } = props;
  if (negative) {
    amount = -amount;
  }

  return (
    <View
      style={[{ flexDirection: 'row', justifyContent: 'space-between' }, style]}
    >
      <Text style={[{ fontSize: 16 }, textStyle]}>{text}</Text>
      <MoneyDisplay amount={amount} style={[{ fontSize: 16 }, textStyle]} />
    </View>
  );
}

export default LineItem;
