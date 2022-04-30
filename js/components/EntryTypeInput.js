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
        color={isCredit ? theme.colors.darkGray : theme.colors.red}
        onPress={() => props.setType('debit')}
        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
      >
        {debitText}
      </Button>
      <Button
        color={isCredit ? theme.colors.green : theme.colors.darkGray}
        onPress={() => props.setType('credit')}
        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
      >
        {creditText}
      </Button>
    </View>
  );
}
