import moment from 'moment';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../../theme';
import { formatAmountToDisplay } from '../../utils/money';

const today = moment();
const dayOfMonth = today.date();
const daysInMonth = today.daysInMonth();

function SpendTracking(props) {
  const { spendingThisMonth, earningThisMonth } = props;
  let diff = undefined;
  if (earningThisMonth !== undefined && spendingThisMonth !== undefined) {
    diff = earningThisMonth - spendingThisMonth;
  }

  return (
    <View style={styles.row}>
      <View style={{ justifyContent: 'space-between' }}>
        <Text
          style={{
            textAlign: 'center',
            marginBottom: 10,
            color: theme.colors.darkGray,
          }}
        >
          {new Date().toLocaleDateString('en-US', { month: 'long' })}
        </Text>
        <Text style={styles.earnAmount}>
          {formatAmountToDisplay(earningThisMonth)}
        </Text>
        <Text style={styles.spendAmount}>
          {formatAmountToDisplay(spendingThisMonth)}
        </Text>
      </View>
      <View>
        <Text
          style={{
            textAlign: 'center',
            marginBottom: 10,
            color: theme.colors.darkGray,
          }}
        >
          Net
        </Text>
        <Text
          style={[
            styles.net,
            {
              color: diff < 0 ? theme.colors.red : theme.colors.green,
              marginBottom: 10,
            },
          ]}
        >
          {formatAmountToDisplay(diff, true)}
        </Text>
      </View>
      <View style={{ justifyContent: 'space-between' }}>
        <Text
          style={{
            alignSelf: 'flex-start',
            textAlign: 'center',
            marginBottom: 10,
            color: theme.colors.darkGray,
          }}
        >
          Est. spend
        </Text>
        <Text style={[styles.spendAmount]}>
          {formatAmountToDisplay(
            (spendingThisMonth / dayOfMonth) * daysInMonth
          )}
        </Text>
        <Text
          style={{
            color: theme.colors.lightGray,
            textAlign: 'center',
            fontWeight: '600',
            fontSize: 14,
            marginBottom: 10,
          }}
        >
          {`(${formatAmountToDisplay(
            spendingThisMonth / dayOfMonth,
            false,
            0
          )}/day)`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  earnAmount: {
    color: theme.colors.green,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  net: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  spendAmount: {
    color: theme.colors.red,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default React.memo(SpendTracking);
