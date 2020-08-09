import { Button } from 'components';
import React from 'react';
import { View } from 'react-native';
import theme from '../theme';

export default function EntryTypeInput(props) {
  var isCredit = props.type == 'credit';
  var creditText = props.creditText || 'Credit';
  var debitText = props.debitText || 'Debit';
  return (
    <View style={[{ flexDirection: 'row' }, props.style]}>
      <Button
        color={isCredit ? theme.colors.green : theme.colors.darkGray}
        onPress={() => props.setType('credit')}
        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, paddingVertical: 6 }}
      >
        {creditText}
      </Button>
      <Button
        color={isCredit ? theme.colors.darkGray : theme.colors.red}
        onPress={() => props.setType('debit')}
        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, paddingVertical: 6 }}
      >
        {debitText}
      </Button>
    </View>
  );
}
