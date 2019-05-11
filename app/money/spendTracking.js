import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../../theme';
import { formatAmountToDisplay } from '../../utils/money';

function SpendTracking(props) {
  const { spendingThisMonth, earningThisMonth } = props;
  let diff = undefined;
  if (earningThisMonth !== undefined && spendingThisMonth !== undefined) {
    diff = earningThisMonth - spendingThisMonth;
  }

  return (
    <View style={sharedStyles.container}>
      <View style={sharedStyles.row}>
        <View>
          <Text style={sharedStyles.title}>Spent</Text>
          <Text style={sharedStyles.spendAmount}>
            {formatAmountToDisplay(spendingThisMonth)}
          </Text>
        </View>
        <View>
          <Text style={[sharedStyles.title, { textAlign: 'center' }]}>
            {new Date().toLocaleDateString('en-US', { month: 'long' })}
          </Text>
          <Text
            style={[
              sharedStyles.spendAmount,
              {
                color: diff < 0 ? theme.colors.red : theme.colors.green,
                textAlign: 'center',
              },
            ]}
          >
            {formatAmountToDisplay(diff, true)}
          </Text>
        </View>
        <View>
          <Text style={[sharedStyles.title, { textAlign: 'right' }]}>
            Earned
          </Text>
          <Text style={[sharedStyles.spendAmount, { textAlign: 'right' }]}>
            {formatAmountToDisplay(earningThisMonth)}
          </Text>
        </View>
      </View>
      {diff > 0 && (
        <View
          style={[
            sharedStyles.row,
            {
              borderRadius: 5,
              overflow: 'hidden',
              height: 25,
              marginTop: 10,
            },
          ]}
        >
          <View
            style={{
              flex: Math.floor(spendingThisMonth),
              backgroundColor: theme.colors.red,
            }}
          />
          <View
            style={{
              flex: Math.floor(diff),
              backgroundColor: theme.colors.green,
            }}
          />
        </View>
      )}
    </View>
  );
}

const sharedStyles = StyleSheet.create({
  container: {
    marginBottom: 10,
    marginLeft: 8,
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  spendAmount: {
    color: theme.colors.darkGray,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    color: '#bbb',
    fontWeight: '600',
    marginBottom: 8,
  },
});

export default React.memo(SpendTracking);
