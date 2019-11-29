import geolocation from '@react-native-community/geolocation';
import React, { useCallback, useEffect, useState } from 'react';
import {
  LayoutAnimation,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import DateInput from '../../../components/dateInput';
import MoneyInput from '../../../components/moneyInput';
import OutlineButton from '../../../components/outlineButton';
import VendorInput from '../../../components/vendorInput';
import { addTransaction } from '../../../db/transactions';
import { getNearbyVendors } from '../../../db/vendors';
import { error, success } from '../../../log';
import { getVendorsArray } from '../../../redux/selectors/vendors';
import sharedStyles from '../../../sharedStyles';
import theme from '../../../theme';

function mapStateToProps(state) {
  var vendors = getVendorsArray(state);
  vendors.unshift({ id: '', name: '' });
  var vendorPickerItems = vendors.map(v => ({
    label: unescape(v.name),
    value: v.id,
  }));
  return {
    vendors,
    vendorPickerItems,
  };
}

function TransactionForm(props) {
  var [date_time, setDateTime] = useState(new Date());
  var [memo, setMemo] = useState('');
  var [amount, setAmount] = useState('');
  var [isCredit, setIsCredit] = useState(false);
  var [is_discretionary, setIsDiscretionary] = useState(true);
  var [moneyInputKey, setMoneyInputKey] = useState(0);
  var [vendor_id, setVendorId] = useState('');
  var [nearbyVendors, setNearbyVendors] = useState([]);
  var [coords, setCoords] = useState();
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
    geolocation.getCurrentPosition(
      function({ coords }) {
        setCoords(coords);
        getNearbyVendors(coords).then(setNearbyVendors);
      },
      function() {},
      { enableHighAccuracy: true }
    );
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
      <View key="thirdRow" style={[sharedStyles.formRow, styles.borderBottom]}>
        <VendorInput
          selectedVendorId={vendor_id}
          onVendorPress={function(id) {
            if (vendor_id == id) {
              setVendorId('');
            } else {
              setVendorId(id);
            }
          }}
          displayTextStyle={[sharedStyles.formTextInput, styles.memoInput]}
          nearbyVendors={nearbyVendors}
        />
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
          }}
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

export default connect(mapStateToProps)(TransactionForm);
