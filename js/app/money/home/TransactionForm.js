import geolocation from '@react-native-community/geolocation';
import { Button, Input } from 'components';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, LayoutAnimation, View } from 'react-native';
import { connect } from 'react-redux';
import CategoryInput from '../../../components/categoryInput';
import DateInput from '../../../components/dateInput';
import EntryTypeInput from '../../../components/EntryTypeInput';
import MoneyInput from '../../../components/moneyInput';
import {
  addTransaction,
  deleteTransaction,
  updateTransaction,
} from '../../../db/transactions';
import { getNearbyVendors } from '../../../db/vendors';
import { error } from '../../../log';
import { getVendorsArray } from '../../../redux/selectors/vendors';
import sharedStyles from '../../../sharedStyles';
import theme from '../../../theme';
import { getDistance, sortByDistance } from '../../../utils/location';

function mapStateToProps(state) {
  var vendors = getVendorsArray(state);
  return {
    vendors: state.vendors,
    vendorArray: vendors,
  };
}

function TransactionForm(props) {
  var [isExpanded, setIsExpanded] = useState(!!props.isExpanded);
  var [date_time, setDateTime] = useState(
    props.date_time ? new Date(props.date_time) : new Date()
  );
  var [memo, setMemo] = useState(props.memo || '');
  var [amount, setAmount] = useState(
    props.amount !== undefined ? props.amount.toString() : ''
  );
  var [entryType, setEntryType] = useState(props.entry_type || 'debit');
  var [moneyInputKey, setMoneyInputKey] = useState(0);
  var [vendor_id, setVendorId] = useState(props.vendor_id || '');
  var [vendorDisplay, setVendorDisplay] = useState(
    props.vendor_id ? props.vendors[props.vendor_id].name : ''
  );
  var [category, setCategory] = useState(props.category || '');
  var [nearbyVendors, setNearbyVendors] = useState([]);
  var [coords, setCoords] = useState();
  var [filteredVendors, setFilteredVendors] = useState([]);
  var resetFormState = useCallback(function (moneyInputKey) {
    setDateTime(new Date());
    setMemo('');
    setAmount('');
    setEntryType('debit');
    setMoneyInputKey(moneyInputKey);
    setVendorId('');
    setCoords(null);
    setCategory('');
    setVendorDisplay('');
  }, []);

  useEffect(
    function () {
      if (!isExpanded || !props.getNearbyVendors) {
        return;
      }
      geolocation.getCurrentPosition(
        function ({ coords }) {
          // eslint-disable-next-line no-undef
          if (__DEV__) {
            coords = {
              latitude: 42.240185,
              longitude: -70.99321,
            };
          }
          setCoords(coords);
          getNearbyVendors(coords)
            .then(function (nearbyVendors) {
              nearbyVendors.forEach(function (v) {
                v.distance = getDistance(coords, v);
              });
              return nearbyVendors;
            })
            .then(function (nearbyVendors) {
              nearbyVendors.sort(sortByDistance);
              return nearbyVendors;
            })
            .then(setNearbyVendors);
        },
        function () {},
        { maximumAge: 300000, enableHighAccuracy: true }
      );
    },
    [isExpanded]
  );
  useEffect(
    function () {
      if (!vendorDisplay) {
        setVendorId('');
        setFilteredVendors([]);
        return;
      }
      if (vendor_id && vendorDisplay === props.vendors[vendor_id].name) {
        return;
      }
      const filteredVendors = props.vendorArray.filter((v) =>
        v.name.toLowerCase().startsWith(vendorDisplay.toLowerCase())
      );
      setFilteredVendors(filteredVendors);
    },
    [vendorDisplay]
  );

  return (
    <View
      style={[
        { backgroundColor: theme.colors.layerOne },
        sharedStyles.formContainer,
        props.style,
      ]}
    >
      <View
        style={[
          sharedStyles.formRow,
          isExpanded && sharedStyles.borderBottom,
          sharedStyles.formFirstRow,
        ]}
      >
        <DateInput
          onFocus={() => {
            LayoutAnimation.easeInEaseOut();
            setIsExpanded(true);
          }}
          onChange={setDateTime}
          date={date_time}
          mode="date"
        />
        <MoneyInput
          onChange={setAmount}
          style={{ flex: 1 }}
          key={moneyInputKey}
          amount={amount}
          editable
          type={entryType}
          onFocus={() => {
            LayoutAnimation.easeInEaseOut();
            setIsExpanded(true);
          }}
          textStyle={{ fontSize: 20 }}
        />
      </View>
      {isExpanded ? (
        <>
          <View style={[{ padding: 10 }, sharedStyles.borderBottom]}>
            <Input
              value={vendorDisplay}
              placeholder="Vendor"
              style={[
                sharedStyles.formTextInput,
                {
                  textAlign: 'right',
                  paddingRight: 0,
                },
              ]}
              onChangeText={setVendorDisplay}
              selectTextOnFocus
              autoCorrect={false}
            />
            <FlatList
              data={filteredVendors.length ? filteredVendors : nearbyVendors}
              horizontal
              renderItem={function ({ item, index }) {
                let selected = item.id == vendor_id;
                return (
                  <Button
                    key={index.toString()}
                    size="small"
                    isOutline
                    status={selected ? 'success' : 'basic'}
                    onPress={function () {
                      if (vendor_id == item.id) {
                        setVendorId('');
                      } else {
                        setVendorId(item.id);
                        setVendorDisplay(item.name);
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
          </View>
          <View style={[sharedStyles.formRow, sharedStyles.borderBottom]}>
            <Input
              style={[
                sharedStyles.formTextInput,
                {
                  textAlign: 'right',
                  paddingRight: 0,
                },
              ]}
              value={memo}
              placeholder="Memo"
              onChangeText={setMemo}
              placeholderTextColor={theme.colors.lightGray}
            />
          </View>
          <View style={[sharedStyles.formRow, sharedStyles.borderBottom]}>
            <EntryTypeInput
              type={entryType}
              setType={setEntryType}
              creditText="Income"
              debitText="Expense"
            />
            <CategoryInput
              displayTextStyle={{
                textAlign: 'right',
                paddingVertical: 10,
              }}
              current={category}
              onPress={function (name) {
                if (category == name) {
                  setCategory('');
                } else {
                  setCategory(name);
                }
              }}
            />
          </View>
          <View style={[sharedStyles.formButtons, { marginTop: 10 }]}>
            {props.id ? (
              <Button
                color={theme.colors.red}
                onPress={() => {
                  Alert.alert(
                    'Confirm',
                    'Do you want to delete this transaction?',
                    [
                      {
                        text: 'Cancel',
                        onPress: function () {},
                      },
                      {
                        text: 'Delete',
                        onPress: () => {
                          deleteTransaction({
                            id: props.id,
                            entry_type: entryType,
                            amount: parseFloat(amount),
                            date_time: date_time,
                            vendor_id,
                          }).then(function () {
                            props.onSave && props.onSave();
                          });
                        },
                        style: 'destructive',
                      },
                    ]
                  );
                }}
              >
                Delete
              </Button>
            ) : (
              <Button
                isOutline
                onPress={() => {
                  LayoutAnimation.easeInEaseOut();
                  resetFormState(moneyInputKey + 1);
                  setIsExpanded(false);
                }}
                color={theme.colors.darkGray}
              >
                Cancel
              </Button>
            )}
            {props.id ? (
              <Button
                color={theme.colors.iosBlue}
                onPress={() => {
                  updateTransaction({
                    id: props.id,
                    entry_type: entryType,
                    amount: parseFloat(amount),
                    date_time: date_time,
                    coords,
                    memo,
                    vendor_id,
                    category,
                  })
                    .then(function () {
                      props.onSave && props.onSave();
                    })
                    .catch(function (e) {
                      error('Error saving transaction', e.message);
                    });
                }}
              >
                Save
              </Button>
            ) : (
              <Button
                disabled={
                  !amount ||
                  amount === '00.00' ||
                  (memo === '' && vendor_id === '')
                }
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
                    .then(function () {
                      LayoutAnimation.easeInEaseOut();
                      resetFormState(moneyInputKey + 1);
                      props.onTransactionAdded && props.onTransactionAdded();
                      setIsExpanded(false);
                    })
                    .catch(function (e) {
                      error('Could not add transaction', e);
                    });
                }}
              >
                Add
              </Button>
            )}
          </View>
        </>
      ) : null}
    </View>
  );
}

export default connect(mapStateToProps)(TransactionForm);
