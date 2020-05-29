import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, TextInput, View } from 'react-native';
import CategoryInput from '../../components/categoryInput';
import DateInput from '../../components/dateInput';
import EntryTypeInput from '../../components/EntryTypeInput';
import MoneyInput from '../../components/moneyInput';
import Screen from '../../components/screen';
import VendorInput from '../../components/vendorInput';
import { deleteTransaction, updateTransaction } from '../../db/transactions';
import { error } from '../../log';
import sharedStyles from '../../sharedStyles';
import theme from '../../theme';
import { Button } from '@ui-kitten/components';

export default function TransactionDetails(props) {
  var [date_time, setDateTime] = useState(new Date());
  var [memo, setMemo] = useState('');
  var [amount, setAmount] = useState('');
  var [entryType, setEntryType] = useState('debit');
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
      setEntryType(transactionFromParam.entry_type);
      setVendorId(transactionFromParam.vendor_id);
      setCategory(transactionFromParam.category);
    },
    [props.route.params]
  );

  return (
    <Screen>
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
      >
        <View style={[sharedStyles.formRow, sharedStyles.borderBottom]}>
          <DateInput onChange={setDateTime} date={date_time} />
          <MoneyInput
            onChange={setAmount}
            amount={amount}
            editable={true}
            style={{ flex: 1 }}
          />
        </View>
        <View style={[sharedStyles.formRow, sharedStyles.borderBottom]}>
          <TextInput
            style={[sharedStyles.formTextInput, { textAlign: 'left' }]}
            value={memo}
            placeholder="Memo"
            onChangeText={setMemo}
            placeholderTextColor={theme.colors.lightGray}
          />
          <VendorInput
            displayTextStyle={[
              sharedStyles.formTextInput,
              {
                textAlign: 'right',
              },
            ]}
            selectedVendorId={vendor_id}
            onVendorPress={function(v) {
              if (vendor_id == v.id) {
                setVendorId('');
                setCategory('');
              } else {
                setVendorId(v.id);
                if (v.category && !category) {
                  setCategory(v.category);
                }
              }
            }}
          />
        </View>
        <View style={[sharedStyles.formRow, sharedStyles.borderBottom]}>
          <EntryTypeInput type={entryType} setType={setEntryType} />
          <CategoryInput
            displayStyle={{
              marginTop: 2,
            }}
            displayTextStyle={{
              textAlign: 'right',
            }}
            current={category}
            onPress={function(name) {
              if (category == name) {
                setCategory('');
              } else {
                setCategory(name);
              }
            }}
          />
        </View>

        <Button
          status="success"
          onPress={() => {
            updateTransaction({
              ...transaction,
              date_time,
              memo,
              amount: parseFloat(amount),
              entry_type: entryType,
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
          style={{ marginTop: 40, marginHorizontal: 10 }}
        >
          Save
        </Button>
        <Button
          status="danger"
          onPress={() => {
            Alert.alert('Confirm', 'Do you want to delete this transaction?', [
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
            ]);
          }}
          style={{ marginTop: 20, marginHorizontal: 10 }}
        >
          Delete
        </Button>
      </ScrollView>
    </Screen>
  );
}
