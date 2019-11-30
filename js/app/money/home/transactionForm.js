import geolocation from '@react-native-community/geolocation';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  LayoutAnimation,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import CategoryInput from '../../../components/categoryInput';
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
    label: v.name,
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
  var [moneyInputKey, setMoneyInputKey] = useState(0);
  var [vendor_id, setVendorId] = useState('');
  var [category, setCategory] = useState('');
  var [nearbyVendors, setNearbyVendors] = useState([]);
  var [coords, setCoords] = useState();
  var resetFormState = useCallback(
    function(moneyInputKey) {
      setDateTime(new Date());
      setMemo('');
      setAmount('');
      setIsCredit(false);
      setMoneyInputKey(moneyInputKey);
      setVendorId('');
      setCoords(null);
      setCategory('');
    },
    [
      setDateTime,
      setMemo,
      setAmount,
      setIsCredit,
      setMoneyInputKey,
      setVendorId,
      setCoords,
      setCategory,
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
        <TextInput
          key="memoInput"
          style={[
            sharedStyles.formTextInput,
            {
              textAlign: 'left',
            },
          ]}
          value={memo}
          placeholder="memo"
          onChangeText={setMemo}
          placeholderTextColor={theme.colors.lightGray}
        />
        <VendorInput
          selectedVendorId={vendor_id}
          onVendorPress={function(v) {
            if (vendor_id == v.id) {
              setVendorId('');
            } else {
              setVendorId(v.id);
            }
            if (v.category && !category) {
              setCategory(v.category);
            }
          }}
          displayTextStyle={[
            sharedStyles.formTextInput,
            {
              textAlign: 'right',
            },
          ]}
          nearbyVendors={nearbyVendors}
        />
      </View>
      {nearbyVendors && nearbyVendors.length ? (
        <View
          style={[
            sharedStyles.formRow,
            sharedStyles.borderBottom,
            { flexDirection: 'column' },
          ]}
        >
          <FlatList
            data={nearbyVendors}
            horizontal
            renderItem={function({ item, index }) {
              let selected = item.id == vendor_id;
              return (
                <OutlineButton
                  key={index.toString()}
                  label={item.name}
                  color={
                    selected ? theme.colors.primary : theme.colors.darkerGray
                  }
                  onPress={function() {
                    if (vendor_id == item.id) {
                      setVendorId('');
                    } else {
                      setVendorId(item.id);
                    }
                  }}
                  style={{ margin: 5 }}
                />
              );
            }}
          />
        </View>
      ) : null}
      <View key="secondRow" style={[sharedStyles.formRow, styles.borderBottom]}>
        <View style={sharedStyles.formSwitchRow}>
          <Text style={{ color: theme.colors.darkGray, marginRight: 10 }}>
            Income?
          </Text>
          <Switch value={isCredit} onValueChange={setIsCredit} />
        </View>
        <CategoryInput
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
              category,
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
});

export default connect(mapStateToProps)(TransactionForm);
