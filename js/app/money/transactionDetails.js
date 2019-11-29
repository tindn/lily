import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateInput from '../../components/dateInput';
import MoneyInput from '../../components/moneyInput';
import Screen from '../../components/screen';
import VendorInput from '../../components/vendorInput';
import { deleteTransaction, updateTransaction } from '../../db/transactions';
import sharedStyles from '../../sharedStyles';
import theme from '../../theme';

export default function TransactionDetails(props) {
  var [date_time, setDateTime] = useState(new Date());
  var [memo, setMemo] = useState('');
  var [amount, setAmount] = useState('');
  var [isCredit, setIsCredit] = useState(false);
  var [is_discretionary, setIsDiscretionary] = useState(true);
  var [transaction, setTransaction] = useState();
  var [vendor_id, setVendorId] = useState('');

  useEffect(
    function() {
      var transactionFromParam = props.navigation.getParam('transaction');
      setTransaction(transactionFromParam);
      setDateTime(new Date(transactionFromParam.date_time));
      setMemo(unescape(transactionFromParam.memo));
      setAmount(transactionFromParam.amount.toString());
      setIsCredit(transactionFromParam.entry_type == 'credit');
      setIsDiscretionary(!!transactionFromParam.is_discretionary);
      setVendorId(transactionFromParam.vendor_id);
    },
    [props]
  );

  return (
    <Screen>
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
      >
        <View
          style={[
            sharedStyles.inputRow,
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          ]}
        >
          <DateInput
            onChange={setDateTime}
            date={date_time}
            style={[{ alignItems: 'flex-end' }]}
          />
          <MoneyInput onChange={setAmount} amount={amount} editable={true} />
        </View>
        <VendorInput
          displayStyle={sharedStyles.inputRow}
          displayTextStyle={{
            textAlign: 'right',
            fontSize: 20,
            fontWeight: '500',
          }}
          selectedVendorId={vendor_id}
          onVendorPress={setVendorId}
        />
        <TextInput
          key="memoInput"
          style={[
            { textAlign: 'right', fontSize: 20, fontWeight: '500' },
            sharedStyles.inputRow,
          ]}
          value={memo}
          placeholder="memo"
          onChangeText={setMemo}
        />
        <View
          key="creditSwitch"
          style={[
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
            sharedStyles.inputRow,
          ]}
        >
          <Text style={{ color: theme.colors.darkGray }}>Income?</Text>
          <Switch value={isCredit} onValueChange={setIsCredit} />
        </View>
        <View
          key="fixedSwitch"
          style={[
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
            sharedStyles.inputRow,
          ]}
        >
          <Text style={{ color: theme.colors.darkGray }}>Discretionary?</Text>
          <Switch value={is_discretionary} onValueChange={setIsDiscretionary} />
        </View>
        <View style={[{ marginTop: 40 }, sharedStyles.actionButton]}>
          <Button
            title="Save"
            onPress={() => {
              updateTransaction({
                ...transaction,
                date_time: date_time,
                memo: memo,
                amount: parseFloat(amount),
                entry_type: isCredit ? 'credit' : 'debit',
                is_discretionary,
                vendor_id,
              }).then(function() {
                props.navigation.pop();
              });
            }}
          />
        </View>
        <View style={[sharedStyles.actionButton, { borderBottomWidth: 0 }]}>
          <Button
            title="Delete"
            onPress={() => {
              Alert.alert(
                'Confirm',
                'Do you want to delete this transaction?',
                [
                  {
                    text: 'Cancel',
                    onPress: function() {},
                  },
                  {
                    text: 'Delete',
                    onPress: () => {
                      deleteTransaction(transaction).then(function() {
                        props.navigation.pop();
                      });
                    },
                    style: 'destructive',
                  },
                ]
              );
            }}
            color={theme.colors.red}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
