import React from 'react';
import { Text } from 'react-native';
import theme from '../../../theme';
import { formatAmountToDisplay } from '../../../../utils/money';

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
      <Text
        style={{
          color: color,
          textAlign: 'center',
          fontWeight: '500',
          fontSize: 16,
        }}
      >
        {formatAmountToDisplay(diff)}
      </Text>
      <Text
        style={{
          color: theme.colors.lightGray,
          textAlign: 'center',
          fontWeight: '600',
          fontSize: 14,
          marginTop: 10,
        }}
      >
        {formatAmountToDisplay(-month.spent, true)}
      </Text>
    </>
  );
}

export default MonthlyAnalyticsOverview;
