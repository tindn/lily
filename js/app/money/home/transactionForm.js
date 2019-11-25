import geolocation from '@react-native-community/geolocation';
import React, { useEffect, useState } from 'react';
import {
  LayoutAnimation,
  Picker,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { addDocument } from '../../../../firebaseHelper';
import { isNearby } from '../../../../utils/location';
import DateInput from '../../../components/dateInput';
import MoneyInput from '../../../components/moneyInput';
import OutlineButton from '../../../components/outlineButton';
import { getAllVendors } from '../../../db';
import sharedStyles from '../../../sharedStyles';
import theme from '../../../theme';

function getDefaultState(moneyInputKey) {
  return {
    date: new Date(),
    memo: '',
    amount: '',
    isCredit: false,
    moneyInputKey: moneyInputKey || 0,
    vendor: '',
    isFixed: false,
  };
}

function TransactionForm(props) {
  var [formState, setFormState] = useState(getDefaultState());
  var [vendors, setVendors] = useState([]);

  useEffect(function() {
    getAllVendors()
      .then(setVendors)
      .then(function() {
        geolocation.getCurrentPosition(
          function({ coords }) {
            setFormState({ ...formState, coords });
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
            setFormState({
              ...formState,
              vendor: nearbyVendors.length === 1 ? nearbyVendors[0].id : '',
            });
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
        <DateInput
          onChange={date => setFormState({ ...formState, date })}
          date={formState.date}
        />
        <MoneyInput
          onChange={amount => setFormState({ ...formState, amount })}
          key={formState.moneyInputKey}
          amount={formState.amount}
          editable
          type={formState.isCredit ? 'credit' : 'debit'}
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
          selectedValue={formState.vendor}
          onValueChange={text => setFormState({ ...formState, vendor: text })}
          style={{ flex: 1, height: 200, top: -20 }}
        >
          {vendors.map(function(item, index) {
            return (
              <Picker.Item key={index} label={item.name} value={item.name} />
            );
          })}
        </Picker>
      </View>
      <View key="fourthRow" style={[sharedStyles.formRow, styles.borderBottom]}>
        <TextInput
          key="memoInput"
          style={[sharedStyles.formTextInput, styles.memoInput]}
          value={formState.memo}
          placeholder="memo"
          onChangeText={text => setFormState({ ...formState, memo: text })}
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
        <Switch
          value={formState.isCredit}
          onValueChange={val => setFormState({ ...formState, isCredit: val })}
        />
        <Text style={{ color: theme.colors.darkGray }}>Fixed?</Text>
        <Switch
          value={formState.isFixed}
          onValueChange={val => setFormState({ ...formState, isFixed: val })}
        />
      </View>
      <View key="buttons" style={sharedStyles.formButtons}>
        <OutlineButton
          label="Cancel"
          onPress={() => {
            LayoutAnimation.easeInEaseOut();
            setFormState(getDefaultState(formState.moneyInputKey + 1));
            props.collapse && props.collapse();
          }}
          style={[sharedStyles.outlineButton]}
          color={theme.colors.darkGray}
        />
        <OutlineButton
          color={theme.colors.primary}
          disabled={
            !formState.amount ||
            formState.amount === '00.00' ||
            (formState.memo === '' && formState.vendor === '')
          }
          label="Add"
          onPress={() => {
            addDocument('transactions', {
              date: formState.date,
              memo: formState.memo,
              vendor: formState.vendor,
              amount: parseFloat(formState.amount),
              entryType: formState.isCredit ? 'credit' : 'debit',
              isFixed: formState.isFixed,
              coords: formState.coords,
              _addedOn: new Date(),
            });
            LayoutAnimation.easeInEaseOut();
            setFormState(getDefaultState(formState.moneyInputKey + 1));
            props.collapse && props.collapse();
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
