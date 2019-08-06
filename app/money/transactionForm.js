import React from 'react';
import {
  LayoutAnimation,
  Picker,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { PreviousNextView } from 'react-native-keyboard-manager';
import { connect } from 'react-redux';
import { addDocument } from '../../firebaseHelper';
import theme from '../../theme';
import { isNearby } from '../../utils/location';
import DateInput from '../dateInput';
import MoneyInput from '../moneyInput';
import OutlineButton from '../outlineButton';
import sharedStyles from '../sharedStyles';

function getDefaultState(moneyInputKey) {
  return {
    date: new Date(),
    memo: '',
    amount: '',
    isCredit: false,
    moneyInputKey: moneyInputKey || 0,
    vendor: '',
    vendors: [],
    isFixed: false,
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
          vendor: nearbyVendors.length === 1 ? nearbyVendors[0].id : '',
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
      }.bind(this),
      { enableHighAccuracy: true }
    );
  }

  render() {
    return (
      <View style={[sharedStyles.formContainer, { top: 10 }]}>
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
          {/* <View key="secondRow" style={[sharedStyles.formRow]}>
            <TextInput
              key="vendorInput"
              style={[sharedStyles.formTextInput, styles.memoInput]}
              value={this.state.vendor}
              placeholder="vendor"
              onChangeText={text => this.setState({ vendor: text })}
            />
          </View> */}
          <View
            key="thirdRow"
            style={[
              sharedStyles.formRow,
              styles.borderBottom,
              { padding: 0, height: 160 },
            ]}
          >
            <Picker
              selectedValue={this.state.vendor}
              onValueChange={text => this.setState({ vendor: text })}
              style={{ flex: 1, height: 200, top: -20 }}
            >
              {this.state.vendors.map(function(item, index) {
                return <Picker.Item key={index} label={item} value={item} />;
              })}
            </Picker>
          </View>
          <View
            key="fourthRow"
            style={[sharedStyles.formRow, styles.borderBottom]}
          >
            <TextInput
              key="memoInput"
              style={[sharedStyles.formTextInput, styles.memoInput]}
              value={this.state.memo}
              placeholder="memo"
              onChangeText={text => this.setState({ memo: text })}
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
              value={this.state.isCredit}
              onValueChange={val => this.setState({ isCredit: val })}
            />
            <Text style={{ color: theme.colors.darkGray }}>Fixed?</Text>
            <Switch
              value={this.state.isFixed}
              onValueChange={val => this.setState({ isFixed: val })}
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
                  isFixed: this.state.isFixed,
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
});

function mapStateToProps(state) {
  return {
    vendors: Object.values(state.vendors),
  };
}

export default connect(mapStateToProps)(TransactionForm);
