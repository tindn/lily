import React from 'react';
import { Text } from 'react-native';
import theme from '../theme';
import { formatAmountToDisplay } from '../utils';

function MoneyDisplay(props) {
  const color = props.amount < 0 ? theme.colors.red : theme.colors.green;
  return (
    <Text
      style={[
        {
          color,
        },
        props.style,
      ]}
    >
      {formatAmountToDisplay(props.amount, props.useParentheses || true)}
    </Text>
  );
}

export default MoneyDisplay;
