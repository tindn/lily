import React from 'react';
import { Button } from '@ui-kitten/components';

export default function EntryTypeInput(props) {
  var isCredit = props.type == 'credit';
  return (
    <>
      <Button
        size="tiny"
        status={isCredit ? 'success' : 'basic'}
        appearance={isCredit ? 'filled' : 'outline'}
        onPress={() => props.setType('credit')}
        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
      >
        Income
      </Button>
      <Button
        size="tiny"
        status={isCredit ? 'basic' : 'danger'}
        appearance={isCredit ? 'outline' : 'filled'}
        onPress={() => props.setType('debit')}
        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
      >
        Expense
      </Button>
    </>
  );
}
