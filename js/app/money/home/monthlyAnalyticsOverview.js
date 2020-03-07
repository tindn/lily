import React from 'react';
import { Text } from 'react-native';
import theme from '../../../theme';
import MoneyDisplay from '../../../components/moneyDisplay';

function MonthlyAnalyticsOverview(props) {
  const { month } = props;
  if (!month) {
    return null;
  }
  const diff = month.earned - month.spent;
  const color = diff >= 0 ? theme.colors.green : theme.colors.red;
  return (
    <>
      <Text
        style={{
          textAlign: 'center',
          marginBottom: 10,
          color: theme.colors.darkGray,
        }}
      >
        {month.name}
      </Text>
      <MoneyDisplay
        amount={month.spent}
        style={{
          textAlign: 'center',
          fontWeight: '500',
          fontSize: 16,
          color: theme.colors.red,
          marginBottom: 10,
        }}
      />
      <MoneyDisplay
        amount={diff}
        style={{
          color: color,
          textAlign: 'center',
          fontWeight: '600',
          fontSize: 14,
        }}
      />
    </>
  );
}

export default MonthlyAnalyticsOverview;
