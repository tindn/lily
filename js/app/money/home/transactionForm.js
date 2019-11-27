import geolocation from '@react-native-community/geolocation';
import React, { useCallback, useEffect, useState } from 'react';
import {
  LayoutAnimation,
  Picker,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { isNearby } from '../../../../utils/location';
import DateInput from '../../../components/dateInput';
import MoneyInput from '../../../components/moneyInput';
import OutlineButton from '../../../components/outlineButton';
import { getAllVendors } from '../../../db';
import { addTransaction } from '../../../db/transactions';
import { error, success } from '../../../log';
import sharedStyles from '../../../sharedStyles';
import theme from '../../../theme';

function TransactionForm(props) {
  var [date_time, setDateTime] = useState(new Date());
  var [memo, setMemo] = useState('');
  var [amount, setAmount] = useState('');
  var [isCredit, setIsCredit] = useState(false);
  var [is_discretionary, setIsDiscretionary] = useState(true);
  var [moneyInputKey, setMoneyInputKey] = useState(0);
  var [vendor_id, setVendorId] = useState('');
  var [coords, setCoords] = useState();
  var [vendors, setVendors] = useState([]);
  var resetFormState = useCallback(
    function(moneyInputKey) {
      setDateTime(new Date());
      setMemo('');
      setAmount('');
      setIsCredit(false);
      setIsDiscretionary(true);
      setMoneyInputKey(moneyInputKey);
      setVendorId('');
      setCoords(null);
    },
    [
      setDateTime,
      setMemo,
      setAmount,
      setIsCredit,
      setIsDiscretionary,
      setMoneyInputKey,
      setVendorId,
      setCoords,
    ]
  );

  useEffect(function() {
    getAllVendors()
      .then(function(vendors) {
        vendors = [{ id: '', name: '' }, ...vendors];
        setVendors(vendors);
      })
      .then(function() {
        geolocation.getCurrentPosition(
          function({ coords }) {
            setCoords(coords);
            // race conditions vendors is empty at this point
            var nearbyVendors = vendors.filter(vendor => {
              if (vendor.locations && vendor.locations.length) {
                return vendor.locations.find(function(location) {
                  if (isNearby(coords, location)) {
                    return true;
                  }
                });
              }
              return false;
            });

            // setVendors(
            //   Array.from(
            //     // eslint-disable-next-line no-undef
            //     new Set(
            //       [{ name: '' }, ...nearbyVendors, ...vendors].map(vendor =>
            //         unescape(vendor.name)
            //       )
            //     )
            //   )
            // );
          },
          function() {},
          { enableHighAccuracy: true }
        );
      });
  }, []);

  return (
    <View style={[sharedStyles.formContainer, props.style]}>
      <View
        key="firstRow"
        style={[
          sharedStyles.formRow,
          styles.borderBottom,
          sharedStyles.formFirstRow,
        ]}
      >
        <DateInput onChange={setDateTime} date={date_time} />
        <MoneyInput
          onChange={setAmount}
          key={moneyInputKey}
          amount={amount}
          editable
          type={isCredit ? 'credit' : 'debit'}
          autoFocus
        />
      </View>
      <View
        key="thirdRow"
        style={[
          sharedStyles.formRow,
          styles.borderBottom,
          { padding: 0, height: 160 },
        ]}
      >
        <Picker
          selectedValue={vendor_id}
          onValueChange={setVendorId}
          style={{ flex: 1, height: 200, top: -20 }}
        >
          {vendors.map(function(item, index) {
            return (
              <Picker.Item
                key={index}
                label={unescape(item.name)}
                value={item.id}
              />
            );
          })}
        </Picker>
      </View>
      <View key="fourthRow" style={[sharedStyles.formRow, styles.borderBottom]}>
        <TextInput
          key="memoInput"
          style={[sharedStyles.formTextInput, styles.memoInput]}
          value={memo}
          placeholder="memo"
          onChangeText={setMemo}
        />
      </View>
      <View
        key="fifthRow"
        style={[
          sharedStyles.formRow,
          sharedStyles.formSwitchRow,
          styles.borderBottom,
        ]}
      >
        <Text style={{ color: theme.colors.darkGray }}>Income?</Text>
        <Switch value={isCredit} onValueChange={setIsCredit} />
        <Text style={{ color: theme.colors.darkGray }}>Discretionary?</Text>
        <Switch value={is_discretionary} onValueChange={setIsDiscretionary} />
      </View>
      <View key="buttons" style={sharedStyles.formButtons}>
        <OutlineButton
          label="Cancel"
          onPress={() => {
            LayoutAnimation.easeInEaseOut();
            resetFormState(moneyInputKey + 1);
            props.collapse && props.collapse();
          }}
          style={[sharedStyles.outlineButton]}
          color={theme.colors.darkGray}
        />
        <OutlineButton
          color={theme.colors.primary}
          disabled={
            !amount || amount === '00.00' || (memo === '' && vendor_id === '')
          }
          label="Add"
          onPress={() => {
            addTransaction({
              entry_type: isCredit ? 'credit' : 'debit',
              amount: parseFloat(amount),
              date_time: date_time,
              coords,
              memo,
              vendor_id,
              is_discretionary,
            })
              .then(function() {
                success('Transaction added');
                LayoutAnimation.easeInEaseOut();
                resetFormState(moneyInputKey + 1);
                props.onTransactionAdded && props.onTransactionAdded();
                props.collapse && props.collapse();
              })
              .catch(function(e) {
                error('Could not add transaction', e);
              });

            // addDocument('transactions', {
            //   date: formState.date,
            //   memo: formState.memo,
            //   vendor: formState.vendor,
            //   amount: parseFloat(formState.amount),
            //   entryType: formState.isCredit ? 'credit' : 'debit',
            //   isFixed: formState.isFixed,
            //   coords: formState.coords,
            //   _addedOn: new Date(),
            // });
            // LayoutAnimation.easeInEaseOut();
            // setFormState(getDefaultState(formState.moneyInputKey + 1));
            // props.collapse && props.collapse();
          }}
          style={[sharedStyles.outlineButton]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  borderBottom: {
    borderBottomColor: theme.colors.lighterGray,
    borderBottomWidth: 1,
  },
  memoInput: {
    textAlign: 'right',
  },
});

export default TransactionForm;
