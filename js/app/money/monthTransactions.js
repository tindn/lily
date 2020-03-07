import React, { useCallback, useState } from 'react';
import { NavigationEvents } from 'react-navigation';
import Screen from '../../components/screen';
import { getTransactionsBetweenTimestampsForCategory } from '../../db/transactions';
import { getMonthStartEndFor } from '../../utils/date';
import TransactionList from './TransactionList';

function MonthTransactions(props) {
  const [data, setData] = useState([]);
  var [refreshing, setRefreshing] = useState(false);
  var date = props.navigation.getParam('date', new Date());
  var category = props.navigation.getParam('category', null);
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
    [date.getTime()]
  );

  return (
    <Screen>
      <NavigationEvents
        onWillFocus={function() {
          fetchData({ useLoadingIndicator: false });
        }}
      />
      <TransactionList
        data={data}
        onTransactionDeleted={fetchData}
        isRefreshing={refreshing}
      />
    </Screen>
  );
}

MonthTransactions.navigationOptions = ({ navigation }) => ({
  headerTitle: navigation
    .getParam('date', new Date())
    .toLocaleDateString('en-US', {
      month: 'long',
    }),
});

export default MonthTransactions;
