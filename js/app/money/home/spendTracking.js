import moment from 'moment';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../../../theme';
import { formatAmountToDisplay } from '../../../utils/money';
import { connect } from 'react-redux';

const today = moment();
const dayOfMonth = today.date();
const daysInMonth = today.daysInMonth();

function SpendTracking(props) {
  var {
    earningThisMonth,
    spendingThisMonth,
    variableSpendingThisMonth,
    estimatedEarning,
    fixedSpending,
  } = props;

  var estimatedSpendingPerDay = variableSpendingThisMonth / dayOfMonth;
  var estimatedSpending = estimatedSpendingPerDay * daysInMonth + fixedSpending;
  var actualNet = earningThisMonth - spendingThisMonth;
  var estimatedNet = estimatedEarning - estimatedSpending;
  var daysLeft = daysInMonth - dayOfMonth;
  var daysLeftText = `${daysLeft} day${daysLeft > 1 ? 's' : ''} left`;

  return (
    <View style={styles.row}>
      <View>
        <Text style={[styles.mainNumber, { color: theme.colors.green }]}>
          {formatAmountToDisplay(earningThisMonth, false, 0)}
        </Text>
        <Text style={[styles.mainNumber, { color: theme.colors.red }]}>
          {formatAmountToDisplay(spendingThisMonth, false, 0)}
        </Text>
        <View style={styles.netLine}>
          <Text
            style={[
              styles.mainNumber,
              {
                color: actualNet > 0 ? theme.colors.green : theme.colors.red,
              },
            ]}
          >
            {formatAmountToDisplay(actualNet, false, 0)}
          </Text>
        </View>
      </View>
      <View>
        <Text style={styles.supportive}>{daysLeftText}</Text>
        <Text style={styles.supportive}>
          {`(${formatAmountToDisplay(estimatedSpendingPerDay, false, 0)}/day)`}
        </Text>
      </View>
      <View>
        <Text style={[styles.mainNumber, { color: theme.colors.green }]}>
          {formatAmountToDisplay(estimatedEarning, false, 0)}
        </Text>
        <Text style={[styles.mainNumber, { color: theme.colors.red }]}>
          {formatAmountToDisplay(estimatedSpending, false, 0)}
        </Text>
        <View style={styles.netLine}>
          <Text
            style={[
              styles.mainNumber,
              {
                color: estimatedNet > 0 ? theme.colors.green : theme.colors.red,
              },
            ]}
          >
            {formatAmountToDisplay(estimatedNet, false, 0)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainNumber: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  supportive: {
    color: theme.colors.darkGray,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  netLine: {
    paddingTop: 10,
    borderColor: theme.colors.lighterGray,
    borderTopWidth: 1,
  },
});

function mapStateToProps(state) {
  return {
    estimatedEarning: state.currentMonthSetup.earnings.reduce(
      (acc, earning) => {
        acc = acc + earning.amount;
        return acc;
      },
      0
    ),
    fixedSpending: state.currentMonthSetup.fixedSpendings.reduce(
      (acc, spend) => {
        acc = acc + spend.amount;
        return acc;
      },
      0
    ),
  };
}

export default connect(mapStateToProps)(SpendTracking);
