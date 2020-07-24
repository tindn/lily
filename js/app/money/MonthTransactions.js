import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import Screen from '../../components/screen';
import { getTransactionsBetweenTimestampsForCategory } from '../../db/transactions';
import { getMonthStartEndFor } from '../../utils/date';
import TransactionList from './TransactionList';

export default function MonthTransactions(props) {
  const [data, setData] = useState([]);
  var [refreshing, setRefreshing] = useState(false);
  const [date] = useState((props.route.params || {}).date || new Date());
  var category = (props.route.params || {}).category;
  var fetchData = useCallback(
    function(params = { useLoadingIndicator: true }) {
      params.useLoadingIndicator && setRefreshing(true);
      var [start, end] = getMonthStartEndFor(date);
      getTransactionsBetweenTimestampsForCategory(
        start.getTime(),
        end.getTime(),
        category
      )
        .then(setData)
        .finally(() => {
          params.useLoadingIndicator && setRefreshing(false);
        });
    },
    [date]
  );

  useFocusEffect(fetchData);

  return (
    <Screen>
      <TransactionList
        data={data}
        onTransactionDeleted={fetchData}
        isRefreshing={refreshing}
      />
    </Screen>
  );
}
