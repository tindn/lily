import { useNavigation } from '@react-navigation/native';
import { addMonths, startOfMonth } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MoneyDisplay from '../../../components/moneyDisplay';
import { getTransactionSumForCategory } from '../../../db/categories';
import sharedStyles from '../../../sharedStyles';
import theme from '../../../theme';
import { getMonthStartEndFor } from '../../../utils/date';

export default function CategoryHistory(props) {
  const [lastMonth, setLastMonth] = useState(0);
  const [lastThreeMonth, setLastThreeMonth] = useState(0);
  var [lastMonthStart, setLastMonthStart] = useState();
  const navigation = useNavigation();
  useEffect(
    function() {
      const today = new Date();
      const [lastMonthStart, lastMonthEnd] = getMonthStartEndFor(
        addMonths(today, -1)
      );
      setLastMonthStart(lastMonthStart);
      getTransactionSumForCategory(
        props.name,
        props.entry_type,
        lastMonthStart.getTime(),
        lastMonthEnd.getTime()
      ).then(setLastMonth);
      getTransactionSumForCategory(
        props.name,
        props.entry_type,
        startOfMonth(addMonths(today, -3)).getTime(),
        lastMonthEnd.getTime()
      )
        .then(amount => amount / 3)
        .then(setLastThreeMonth);
    },
    [props.name, props.entry_type]
  );
  return (
    <View style={{ paddingVertical: 20, paddingHorizontal: 10 }}>
      <View
        style={[
          sharedStyles.borderBottom,
          { marginBottom: 5, paddingBottom: 5 },
        ]}
      >
        <Text style={{ fontSize: 20, fontWeight: '500' }}>{props.name}</Text>
      </View>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 10,
        }}
        onPress={function() {
          props.hide();
          navigation.navigate('MonthTransactions', {
            date: lastMonthStart,
            category: props.name,
          });
        }}
      >
        <Text style={{ fontSize: 16 }}>Last month</Text>
        <MoneyDisplay
          amount={lastMonth}
          useParentheses={false}
          style={[
            { fontSize: 16 },
            props.entry_type == 'debit' && {
              color: theme.colors.red,
            },
          ]}
        />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 10,
        }}
      >
        <Text style={{ fontSize: 16 }}>Last 3 months average</Text>
        <MoneyDisplay
          amount={lastThreeMonth}
          useParentheses={false}
          style={[
            { fontSize: 16 },
            props.entry_type == 'debit' && {
              color: theme.colors.red,
            },
          ]}
        />
      </View>
    </View>
  );
}
