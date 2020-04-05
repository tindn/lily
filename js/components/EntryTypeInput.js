import { Button } from '@ui-kitten/components';
import React from 'react';
import { View } from 'react-native';

export default function EntryTypeInput(props) {
  var isCredit = props.type == 'credit';
  var creditText = props.creditText || 'Credit';
  var debitText = props.debitText || 'Debit';
  return (
    <View style={[{ flexDirection: 'row' }, props.style]}>
      <Button
        size="tiny"
        status={isCredit ? 'success' : 'basic'}
        appearance={isCredit ? 'filled' : 'outline'}
        onPress={() => props.setType('credit')}
        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
      >
        {creditText}
      </Button>
      <Button
        size="tiny"
        status={isCredit ? 'basic' : 'danger'}
        appearance={isCredit ? 'outline' : 'filled'}
        onPress={() => props.setType('debit')}
        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
      >
        {debitText}
      </Button>
    </View>
  );
}
