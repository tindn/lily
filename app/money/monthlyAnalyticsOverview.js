import React from 'react';
import { Text, View } from 'react-native';
import theme from '../../theme';
import { formatAmountToDisplay } from '../../utils/money';

function MonthlyAnalyticsOverview(props) {
  const { data } = props;
  return data.map(month => {
    const diff = month.earned - month.spent;
    const color = diff >= 0 ? theme.colors.green : theme.colors.red;
    return (
      <View key={month.id}>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: '500',
            marginBottom: 10,
          }}
        >
          {month.id}
        </Text>
        <Text
          style={[
            {
              color,
              textAlign: 'center',
              fontWeight: '500',
              fontSize: 16,
            },
          ]}
        >
          {formatAmountToDisplay(diff, true)}
        </Text>
      </View>
    );
  });
}

export default MonthlyAnalyticsOverview;
