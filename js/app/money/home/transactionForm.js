import geolocation from '@react-native-community/geolocation';
import { Button, Layout } from '@ui-kitten/components';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, LayoutAnimation, TextInput, View } from 'react-native';
import { connect } from 'react-redux';
import CategoryInput from '../../../components/categoryInput';
import DateInput from '../../../components/dateInput';
import EntryTypeInput from '../../../components/EntryTypeInput';
import MoneyInput from '../../../components/moneyInput';
import VendorInput from '../../../components/vendorInput';
import { addTransaction } from '../../../db/transactions';
import { getNearbyVendors } from '../../../db/vendors';
import { error } from '../../../log';
import { getVendorsArray } from '../../../redux/selectors/vendors';
import sharedStyles from '../../../sharedStyles';
import theme from '../../../theme';
import { useThemeColors } from '../../../uiKittenTheme';
import { getDistance, sortByDistance } from '../../../utils/location';

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
  var [isExpanded, setIsExpanded] = useState(false);
  var [date_time, setDateTime] = useState(new Date());
  var [memo, setMemo] = useState('');
  var [amount, setAmount] = useState('');
  var [entryType, setEntryType] = useState('debit');
  var [moneyInputKey, setMoneyInputKey] = useState(0);
  var [vendor_id, setVendorId] = useState('');
  var [category, setCategory] = useState('');
  var [nearbyVendors, setNearbyVendors] = useState([]);
  var [coords, setCoords] = useState();
  var colors = useThemeColors();
  var resetFormState = useCallback(
    function(moneyInputKey) {
      setDateTime(new Date());
      setMemo('');
      setAmount('');
      setEntryType('debit');
      setMoneyInputKey(moneyInputKey);
      setVendorId('');
      setCoords(null);
      setCategory('');
    },
    [
      setDateTime,
      setMemo,
      setAmount,
      setEntryType,
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
        getNearbyVendors(coords)
          .then(function(nearbyVendors) {
            nearbyVendors.forEach(function(v) {
              v.distance = getDistance(coords, v);
            });
            return nearbyVendors;
          })
          .then(function(nearbyVendors) {
            nearbyVendors.sort(sortByDistance);
            return nearbyVendors;
          })
          .then(setNearbyVendors);
      },
      function() {},
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <Layout
      style={[sharedStyles.formContainer, props.style]}
      backgroundLevel="3"
    >
      <View
        style={[
          sharedStyles.formRow,
          isExpanded && sharedStyles.borderBottom,
          sharedStyles.formFirstRow,
        ]}
      >
        <DateInput onChange={setDateTime} date={date_time} />
        <MoneyInput
          onChange={setAmount}
          key={moneyInputKey}
          amount={amount}
          editable
          type={entryType}
          onFocus={() => {
            LayoutAnimation.easeInEaseOut();
            setIsExpanded(true);
          }}
        />
      </View>
      {isExpanded ? (
        <>
          <View style={[sharedStyles.formRow, sharedStyles.borderBottom]}>
            <TextInput
              style={[
                sharedStyles.formTextInput,
                {
                  textAlign: 'left',
                  color: colors.textColor,
                },
              ]}
              value={memo}
              placeholder="Memo"
              onChangeText={setMemo}
              placeholderTextColor={theme.colors.lightGray}
            />
            <VendorInput
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
              displayTextStyle={[
                sharedStyles.formTextInput,
                {
                  textAlign: 'right',
                  color: colors.textColor,
                },
              ]}
            />
          </View>
          <FlatList
            data={nearbyVendors}
            horizontal
            renderItem={function({ item, index }) {
              let selected = item.id == vendor_id;
              return (
                <Button
                  key={index.toString()}
                  size="small"
                  appearance="outline"
                  status={selected ? 'success' : 'basic'}
                  onPress={function() {
                    if (vendor_id == item.id) {
                      setVendorId('');
                    } else {
                      setVendorId(item.id);
                    }
                    if (item.category && !category) {
                      setCategory(item.category);
                    }
                  }}
                  style={{ margin: 5 }}
                >
                  {item.name}
                </Button>
              );
            }}
            contentContainerStyle={[!nearbyVendors.length && { padding: 0 }]}
            ListEmptyComponent={null}
          />
          <View style={[sharedStyles.formRow, sharedStyles.borderBottom]}>
            <EntryTypeInput
              type={entryType}
              setType={setEntryType}
              creditText="Income"
              debitText="Expense"
            />
            <CategoryInput
              displayStyle={{
                marginTop: 2,
              }}
              displayTextStyle={{
                textAlign: 'right',
                color: colors.textColor,
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
          <View style={[sharedStyles.formButtons, { marginTop: 10 }]}>
            <Button
              status="basic"
              size="small"
              appearance="outline"
              onPress={() => {
                LayoutAnimation.easeInEaseOut();
                resetFormState(moneyInputKey + 1);
                setIsExpanded(false);
              }}
              color={theme.colors.darkGray}
            >
              Cancel
            </Button>
            <Button
              disabled={
                !amount ||
                amount === '00.00' ||
                (memo === '' && vendor_id === '')
              }
              size="small"
              onPress={() => {
                addTransaction({
                  entry_type: entryType,
                  amount: parseFloat(amount),
                  date_time: date_time,
                  coords,
                  memo,
                  vendor_id,
                  category,
                })
                  .then(function() {
                    LayoutAnimation.easeInEaseOut();
                    resetFormState(moneyInputKey + 1);
                    props.onTransactionAdded && props.onTransactionAdded();
                    setIsExpanded(false);
                  })
                  .catch(function(e) {
                    error('Could not add transaction', e);
                  });
              }}
            >
              Add
            </Button>
          </View>
        </>
      ) : null}
    </Layout>
  );
}

export default connect(mapStateToProps)(TransactionForm);
