import React, { useState, useEffect } from 'react';
import { Alert, Switch, Text, TextInput, View } from 'react-native';
import DateInput from '../../../components/dateInput';
import MoneyInput from '../../../components/moneyInput';
import OutlineButton from '../../../components/outlineButton';
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

  function updateType(val) {
    setEntryType(val ? 'credit' : 'debit');

    if (isBalanceUpdate) {
      setBalance(props.accountBalance + (val ? 1 : -1) * amount);
    }
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
    <View style={sharedStyles.formContainer}>
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
          textStyle={{
            flex: 10,
            color:
              entry_type === 'debit' ? theme.colors.red : theme.colors.green,
          }}
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
        key="creditSwitch"
        style={[
          sharedStyles.formRow,
          sharedStyles.borderBottom,
          sharedStyles.formSwitchRow,
        ]}
      >
        <Text style={{ color: theme.colors.darkGray }}>{entry_type}</Text>
        <Switch value={entry_type === 'credit'} onValueChange={updateType} />
      </View>
      {isBalanceUpdate && (
        <View style={[sharedStyles.formRow, sharedStyles.borderBottom]}>
          <View style={{ justifyContent: 'center' }}>
            <Text style={{ color: theme.colors.darkGray }}>New balance</Text>
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
        <OutlineButton
          label="Cancel"
          onPress={props.onCancel}
          color={theme.colors.darkGray}
        />
        {id ? (
          <OutlineButton
            label="Delete"
            onPress={confirmDelete}
            color={theme.colors.red}
          />
        ) : (
          <OutlineButton
            label="Balance"
            onPress={onBalancePressed}
            color="#000"
            labelElement={
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    color: '#000',
                  }}
                >
                  Balance
                </Text>
              </View>
            }
          />
        )}
        <OutlineButton
          label={id ? 'Save' : 'Add'}
          onPress={save}
          color={id ? theme.colors.primary : theme.colors.iosBlue}
        />
      </View>
    </View>
  );
}

export default AccountEntryForm;
