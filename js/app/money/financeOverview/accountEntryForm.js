import { Button, Layout, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import DateInput from '../../../components/dateInput';
import EntryTypeInput from '../../../components/EntryTypeInput';
import MoneyInput from '../../../components/moneyInput';
import {
  addAccountEntry,
  removeAccountEntry,
  updateAccountEntry,
} from '../../../db/accountEntries';
import { useToggle } from '../../../hooks';
import sharedStyles from '../../../sharedStyles';
import theme from '../../../theme';

function AccountEntryForm(props) {
  var [id, setId] = useState('');
  var [amount, setAmount] = useState(0);
  var [memo, setMemo] = useState('');
  var [entry_type, setEntryType] = useState('credit');
  var [date_time, setDateTime] = useState(new Date());
  var [isBalanceUpdate, toggleBalanceUpdate] = useToggle();
  var [balance, setBalance] = useState(props.accountBalance);

  useEffect(
    function() {
      if (props.entry) {
        setId(props.entry.id);
        setAmount(props.entry.amount);
        setMemo(props.entry.memo);
        setEntryType(props.entry.entry_type);
        setDateTime(new Date(props.entry.date_time));
      }
    },
    [props.entry]
  );

  function onBalancePressed() {
    toggleBalanceUpdate();
    setMemo(isBalanceUpdate ? '' : 'Balance update');
  }

  function updateBalanceAmount(amount) {
    let diff = amount - props.accountBalance;
    setBalance(amount);
    setAmount(Math.abs(diff));
    setEntryType(diff < 0 ? 'debit' : 'credit');
  }

  function confirmDelete() {
    Alert.alert('Confirm', 'Do you want to delete this entry?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          removeAccountEntry(props.entry).then(function() {
            props.onCancel && props.onCancel();
            props.onEntryChange && props.onEntryChange();
          });
        },
        style: 'destructive',
      },
    ]);
  }

  function save() {
    const entry = {
      id,
      date_time: date_time.getTime(),
      memo,
      amount: parseFloat(amount),
      entry_type,
      account_id: props.accountId,
    };
    var saveFunction = id ? updateAccountEntry : addAccountEntry;

    saveFunction(entry).then(function() {
      props.onCancel && props.onCancel();
      props.onEntryChange && props.onEntryChange();
    });
  }

  return (
    <Layout style={[sharedStyles.formContainer, props.style]}>
      <View
        style={[
          sharedStyles.formRow,
          sharedStyles.formFirstRow,
          sharedStyles.borderBottom,
        ]}
      >
        <DateInput
          onChange={setDateTime}
          date={date_time}
          style={{ flex: 9 }}
          mode="date"
        />
        <MoneyInput
          onChange={setAmount}
          amount={amount}
          type={entry_type}
          autoFocus={props.autoFocus}
        />
      </View>
      <View style={[sharedStyles.formRow, sharedStyles.borderBottom]}>
        <TextInput
          value={memo}
          style={[sharedStyles.formTextInput, { textAlign: 'right' }]}
          onChangeText={setMemo}
          placeholderTextColor={theme.colors.lightGray}
        />
      </View>
      <View
        style={[
          sharedStyles.formRow,
          sharedStyles.borderBottom,
          { justifyContent: 'flex-end' },
        ]}
      >
        <EntryTypeInput type={entry_type} setType={setEntryType} />
      </View>
      {isBalanceUpdate && (
        <View style={[sharedStyles.formRow, sharedStyles.borderBottom]}>
          <View style={{ justifyContent: 'center' }}>
            <Text>New balance</Text>
          </View>
          <MoneyInput
            onChange={updateBalanceAmount}
            amount={balance}
            textStyle={{
              flex: 10,
            }}
            autoFocus={props.autoFocus}
          />
        </View>
      )}
      <View key="buttons" style={sharedStyles.formButtons}>
        <Button size="small" status="basic" onPress={props.onCancel}>
          Cancel
        </Button>
        {id ? (
          <Button size="small" status="danger" onPress={confirmDelete}>
            Delete
          </Button>
        ) : (
          <Button size="small" onPress={onBalancePressed} status="warning">
            Balance
          </Button>
        )}
        <Button size="small" onPress={save}>
          {id ? 'Save' : 'Add'}
        </Button>
      </View>
    </Layout>
  );
}

export default AccountEntryForm;
