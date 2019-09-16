import moment from 'moment';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../../theme';
import { formatAmountToDisplay } from '../../utils/money';

const today = moment();
const dayOfMonth = today.date();
const daysInMonth = today.daysInMonth();

function SpendTracking(props) {
  var {
    spendingThisMonth,
    fixedSpendingThisMonth,
    variableSpendingThisMonth,
  } = props;

  var estimatedSpendingPerDay = variableSpendingThisMonth / dayOfMonth;
  var estimatedEarning = 8400;
  var estimatedSpending =
    estimatedSpendingPerDay * daysInMonth + fixedSpendingThisMonth;
  var estimatedNet = estimatedEarning - estimatedSpending;

  return (
    <View style={styles.row}>
      <View style={{}}>
        <Text
          style={[
            styles.mainNumber,
            { color: theme.colors.red, marginBottom: 10 },
          ]}
        >
          {formatAmountToDisplay(spendingThisMonth)}
        </Text>
        <Text style={styles.supportive}>
          {`(${formatAmountToDisplay(estimatedSpendingPerDay, false, 0)}/day)`}
        </Text>
      </View>
      <View>
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <Text style={[styles.supportive]}>
            {formatAmountToDisplay(estimatedEarning, false, 0)}
          </Text>
          <Text style={[styles.supportive]}>{` -  `}</Text>
          <Text style={[styles.supportive]}>
            {formatAmountToDisplay(estimatedSpending, false, 0)}
          </Text>
        </View>
        <Text
          style={[
            styles.mainNumber,
            { color: estimatedNet > 0 ? theme.colors.green : theme.colors.red },
          ]}
        >
          {formatAmountToDisplay(estimatedNet, false, 0)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainNumber: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  supportive: {
    color: theme.colors.darkGray,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default React.memo(SpendTracking);
