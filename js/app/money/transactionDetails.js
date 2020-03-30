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
import CategoryInput from '../../components/categoryInput';
import DateInput from '../../components/dateInput';
import MoneyInput from '../../components/moneyInput';
import Screen from '../../components/screen';
import VendorInput from '../../components/vendorInput';
import { deleteTransaction, updateTransaction } from '../../db/transactions';
import { error } from '../../log';
import sharedStyles from '../../sharedStyles';
import theme from '../../theme';

export default function TransactionDetails(props) {
  var [date_time, setDateTime] = useState(new Date());
  var [memo, setMemo] = useState('');
  var [amount, setAmount] = useState('');
  var [isCredit, setIsCredit] = useState(false);
  var [transaction, setTransaction] = useState();
  var [vendor_id, setVendorId] = useState('');
  var [category, setCategory] = useState(undefined);

  useEffect(
    function() {
      var transactionFromParam = (props.route.params || {}).transaction;
      setTransaction(transactionFromParam);
      setDateTime(new Date(transactionFromParam.date_time));
      setMemo(transactionFromParam.memo);
      setAmount(transactionFromParam.amount.toString());
      setIsCredit(transactionFromParam.entry_type == 'credit');
      setVendorId(transactionFromParam.vendor_id);
      setCategory(transactionFromParam.category);
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
            style={{ alignItems: 'flex-end' }}
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
          onVendorPress={function(v) {
            setVendorId(v.id);
          }}
        />
        <TextInput
          key="memoInput"
          style={[
            { textAlign: 'right', fontSize: 20, fontWeight: '500' },
            sharedStyles.inputRow,
            sharedStyles.formTextInput,
          ]}
          value={memo}
          placeholder="Memo"
          onChangeText={setMemo}
          placeholderTextColor={theme.colors.lightGray}
        />
        <View
          key="creditSwitch"
          style={[sharedStyles.formRow, sharedStyles.borderBottom]}
        >
          <View style={sharedStyles.formSwitchRow}>
            <Text style={{ color: theme.colors.darkGray, marginRight: 10 }}>
              Income?
            </Text>
            <Switch value={isCredit} onValueChange={setIsCredit} />
          </View>
          <CategoryInput
            displayStyle={{ alignItems: 'flex-end', marginTop: 2 }}
            current={category}
            onPress={function(name) {
              if (category == name) {
                setCategory(undefined);
              } else {
                setCategory(name);
              }
            }}
          />
        </View>

        <View style={[{ marginTop: 40 }, sharedStyles.actionButton]}>
          <Button
            title="Save"
            onPress={() => {
              updateTransaction({
                ...transaction,
                date_time,
                memo,
                amount: parseFloat(amount),
                entry_type: isCredit ? 'credit' : 'debit',
                vendor_id,
                category,
              })
                .then(function() {
                  props.navigation.pop();
                })
                .catch(function(e) {
                  error('Error saving transaction', e.message);
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
