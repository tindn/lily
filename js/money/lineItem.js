import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import MoneyDisplay from '../components/moneyDisplay';

function LineItem(props) {
  let { text, amount, style, textStyle, negative } = props;
  if (negative) {
    amount = -amount;
  }

  return (
    <View style={[styles.row, style]}>
      <Text style={[styles.text, textStyle]}>{text}</Text>
      <MoneyDisplay amount={amount} style={[styles.text, textStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LineItem;
