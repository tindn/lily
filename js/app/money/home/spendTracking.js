import moment from 'moment';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MoneyDisplay from '../../../components/moneyDisplay';
import theme from '../../../theme';

const today = moment();
const dayOfMonth = today.date();
const daysInMonth = today.daysInMonth();

function SpendTracking(props) {
  var { earningThisMonth, spendingThisMonth } = props;

  var actualNet = earningThisMonth - spendingThisMonth;
  var daysLeft = daysInMonth - dayOfMonth;
  var daysLeftText = `${daysLeft} day${daysLeft > 1 ? 's' : ''} left`;

  return (
    <>
      <View style={styles.row}>
        <View>
          <MoneyDisplay
            amount={earningThisMonth}
            useParentheses={false}
            toFixed={0}
            style={styles.mainNumber}
          />
          <MoneyDisplay
            amount={-spendingThisMonth}
            useParentheses={false}
            toFixed={0}
            style={styles.mainNumber}
          />
        </View>
        <View>
          <MoneyDisplay
            amount={actualNet}
            style={styles.mainNumber}
            useParentheses={false}
            toFixed={0}
          />
          <Text style={styles.supportive}>{daysLeftText}</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainNumber: {
    fontSize: 17,
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  supportive: {
    color: theme.colors.darkGray,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default SpendTracking;
