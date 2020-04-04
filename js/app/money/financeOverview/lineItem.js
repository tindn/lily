import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import MoneyDisplay from '../../../components/MoneyDisplay';

function LineItem(props) {
  let { text, amount, style, textStyle, negative, onPress } = props;
  if (negative) {
    amount = -amount;
  }

  return (
    <TouchableOpacity style={[styles.row, style]} onPress={onPress}>
      <Text style={[styles.text, textStyle]}>{text}</Text>
      <MoneyDisplay amount={amount} style={[styles.text, textStyle]} />
    </TouchableOpacity>
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
