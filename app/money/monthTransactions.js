import React from 'react';
import Screen from '../screen';
import TransactionList from './transactionList';

function MonthTransactions(props) {
  return (
    <Screen>
      <TransactionList
        data={props.navigation.state.params.data}
        refreshing={false}
        navigation={props.navigation}
      />
    </Screen>
  );
}

export default React.memo(MonthTransactions);
