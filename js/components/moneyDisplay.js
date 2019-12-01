import React from 'react';
import { Text } from 'react-native';
import theme from '../theme';
import { formatAmountToDisplay } from '../utils/money';

function MoneyDisplay(props) {
  const color =
    props.amount == 0
      ? theme.colors.darkerGray
      : props.amount < 0
      ? theme.colors.red
      : theme.colors.green;
  if (props.useParentheses == undefined) {
    props.useParentheses = true;
  }
  if (props.toFixed == undefined) {
    props.toFixed = 2;
  }
  return (
    <Text
      style={[
        {
          color,
        },
        props.style,
      ]}
    >
      {formatAmountToDisplay(props.amount, props.useParentheses, props.toFixed)}
    </Text>
  );
}

export default MoneyDisplay;
