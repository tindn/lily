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
  var { earningThisMonth, spendingThisMonth } = props;

  var actualNet = earningThisMonth - spendingThisMonth;
  var daysLeft = daysInMonth - dayOfMonth;
  var daysLeftText = `${daysLeft} day${daysLeft > 1 ? 's' : ''} left`;

  return (
    <View>
      <View style={styles.row}>
        <Text style={[styles.mainNumber, { color: theme.colors.green }]}>
          {formatAmountToDisplay(earningThisMonth, false, 0)}
        </Text>
        <Text style={[styles.mainNumber, { color: theme.colors.red }]}>
          {formatAmountToDisplay(spendingThisMonth, false, 0)}
        </Text>
        <View>
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
