import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import Screen from '../../components/screen';
import TransactionForm from './home/TransactionForm';

export default function TransactionDetails(props) {
  var [transaction, setTransaction] = useState();

  useEffect(
    function () {
      var transactionFromParam = (props.route.params || {}).transaction;
      setTransaction(transactionFromParam);
    },
    [props.route.params]
  );

  return (
    <Screen>
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
      >
        {transaction ? (
          <TransactionForm
            {...transaction}
            isExpanded
            onSave={() => {
              props.navigation.pop();
            }}
          />
        ) : null}
      </ScrollView>
    </Screen>
  );
}
