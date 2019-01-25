import React from 'react';
import {
  LayoutAnimation,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import theme from '../../theme';
import OutlineButton from '../outlineButton';
import DateInput from '../dateInput';
import MoneyInput from '../moneyInput';
import sharedStyles from '../sharedStyles';
import { addDocument } from '../../firebaseHelper';
import PickerInput from '../pickerInput';
import { connect } from 'react-redux';
import { isNearby } from '../../utils/location';
import { PreviousNextView } from 'react-native-keyboard-manager';

function getDefaultState(moneyInputKey) {
  return {
    date: new Date(),
    memo: '',
    amount: '',
    isCredit: false,
    moneyInputKey: moneyInputKey || 0,
    vendor: '',
    vendors: [],
  };
}

class TransactionForm extends React.Component {
  state = getDefaultState();

  componentDidMount() {
    // eslint-disable-next-line no-undef
    navigator.geolocation.getCurrentPosition(
      function({ coords }) {
        this.setState({ coords });
        const nearbyVendors = this.props.vendors.filter(vendor => {
          if (vendor.locations && vendor.locations.length) {
            return vendor.locations.find(function(location) {
              if (isNearby(coords, location)) {
                return true;
              }
            });
          }
          return false;
        });

        this.setState({
          vendors: Array.from(
            // eslint-disable-next-line no-undef
            new Set(
              [{ id: '' }, ...nearbyVendors, ...this.props.vendors].map(
                vendor => unescape(vendor.id)
              )
            )
          ),
        });
      }.bind(this),
      function() {
        this.setState({
          vendors: Array.from(
            // eslint-disable-next-line no-undef
            new Set(
              [{ id: '' }, ...this.props.vendors].map(vendor =>
                unescape(vendor.id)
              )
            )
          ),
        });
      },
      { enableHighAccuracy: true }
    );
  }
  render() {
    return (
      <View style={[sharedStyles.formContainer, { top: 30 }]}>
        <PreviousNextView>
          <View
            key="firstRow"
            style={[
              sharedStyles.formRow,
              styles.borderBottom,
              sharedStyles.formFirstRow,
            ]}
          >
            <DateInput
              onChange={date => this.setState({ date })}
              date={this.state.date}
            />
            <MoneyInput
              onChange={amount => this.setState({ amount })}
              key={this.state.moneyInputKey}
              amount={this.state.amount}
              editable={true}
              type={this.state.isCredit ? 'credit' : 'debit'}
            />
          </View>
          <View
            key="secondRow"
            style={[sharedStyles.formRow, styles.borderBottom]}
          >
            <PickerInput
              value={this.state.vendor}
              onChangeText={text => this.setState({ vendor: text })}
              dropDownList={this.state.vendors}
              style={[sharedStyles.formTextInput, styles.vendorInput]}
              placeholder="vendor"
            />
            <TextInput
              key="memoInput"
              style={[sharedStyles.formTextInput, styles.memoInput]}
              value={this.state.memo}
              placeholder="memo"
              onChangeText={text => this.setState({ memo: text })}
            />
          </View>
          <View
            key="creditSwitch"
            style={[sharedStyles.formRow, sharedStyles.formSwitchRow]}
          >
            <Text style={{ color: theme.colors.darkGray }}>
              {this.state.isCredit ? 'Income' : 'Expense'}
            </Text>
            <Switch
              value={this.state.isCredit}
              onValueChange={val => this.setState({ isCredit: val })}
            />
          </View>
          <View key="buttons" style={sharedStyles.formButtons}>
            <OutlineButton
              label="Cancel"
              onPress={() => {
                LayoutAnimation.easeInEaseOut();
                this.setState(getDefaultState(this.state.moneyInputKey + 1));
                this.props.collapse && this.props.collapse();
              }}
              style={[sharedStyles.outlineButton]}
              color={theme.colors.darkGray}
            />
            <OutlineButton
              color={theme.colors.primary}
              disabled={
                !this.state.amount ||
                this.state.amount === '00.00' ||
                (this.state.memo === '' && this.state.vendor === '')
              }
              label="Add"
              onPress={() => {
                addDocument('transactions', {
                  date: this.state.date,
                  memo: this.state.memo,
                  vendor: this.state.vendor,
                  amount: parseFloat(this.state.amount),
                  entryType: this.state.isCredit ? 'credit' : 'debit',
                  coords: this.state.coords,
                  _addedOn: new Date(),
                });
                LayoutAnimation.easeInEaseOut();
                this.setState(getDefaultState(this.state.moneyInputKey + 1));
                this.props.collapse && this.props.collapse();
              }}
              style={[sharedStyles.outlineButton]}
            />
          </View>
        </PreviousNextView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  borderBottom: {
    borderBottomColor: theme.colors.lighterGray,
    borderBottomWidth: 1,
  },
  memoInput: {
    textAlign: 'right',
  },
  vendorInput: {
    textAlign: 'left',
  },
});

function mapStateToProps(state) {
  return {
    vendors: Object.values(state.vendors),
  };
}

export default connect(mapStateToProps)(TransactionForm);
