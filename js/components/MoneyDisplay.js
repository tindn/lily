import { Text } from 'components';
import React from 'react';
import { formatAmountToDisplay } from '../utils/money';

function MoneyDisplay(props) {
  let color =
    props.amount == 0 ? 'basic' : props.amount < 0 ? 'danger' : 'success';
  if (props.type) {
    if (props.type == 'credit') {
      color = 'success';
    }
    if (props.type == 'debit') {
      color = 'danger';
    }
  }
  if (props.useParentheses == undefined) {
    props.useParentheses = true;
  }
  if (props.toFixed == undefined) {
    props.toFixed = 2;
  }
  return (
    <Text status={color} style={props.style}>
      {formatAmountToDisplay(props.amount, props.useParentheses, props.toFixed)}
    </Text>
  );
}

export default MoneyDisplay;
