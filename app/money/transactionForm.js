import React from 'react';
import {
  LayoutAnimation,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import theme from '../../theme';
import { addTransaction } from '../../utils';
import OutlineButton from '../outlineButton';
import DateInput from '../dateInput';
import MoneyInput from '../moneyInput';

const smallFontSize = 20;

function getDefaultState(moneyInputKey) {
  return {
    date: new Date(),
    memo: '',
    amount: '',
    isCredit: false,
    moneyInputKey: moneyInputKey || 0,
    vendor: '',
  };
}

class TransactionForm extends React.Component {
  state = getDefaultState();

  render() {
    return (
      <View style={sharedStyles.container}>
        {this.props.isExpanded && [
          <View
            key="firstRow"
            style={[
              sharedStyles.row,
              sharedStyles.borderBottom,
              sharedStyles.firstRow,
            ]}
          >
            <DateInput
              onChange={date => this.setState({ date })}
              date={this.state.date}
              style={{ flex: 9 }}
            />
            <MoneyInput
              style={{ flex: 10 }}
              onChange={amount => this.setState({ amount })}
              key={this.state.moneyInputKey}
              amount={this.state.amount}
            />
          </View>,
          <View
            key="secondRow"
            style={[
              sharedStyles.row,
              sharedStyles.borderBottom,
              sharedStyles.secondRow,
            ]}
          >
            <TextInput
              key="vendorInput"
              style={sharedStyles.vendorInput}
              value={this.state.vendor}
              placeholder="vendor"
              onChangeText={text => this.setState({ vendor: text })}
            />
            <TextInput
              key="memoInput"
              style={sharedStyles.memoInput}
              value={this.state.memo}
              placeholder="memo"
              onChangeText={text => this.setState({ memo: text })}
            />
          </View>,
          <View
            key="creditSwitch"
            style={[sharedStyles.row, sharedStyles.isCreditSwitch]}
          >
            <Text style={{ color: theme.colors.darkGray }}>Income</Text>
            <Switch
              value={this.state.isCredit}
              onValueChange={val => this.setState({ isCredit: val })}
            />
          </View>,
          <View key="buttons" style={sharedStyles.buttonContainer}>
            <OutlineButton
              label="Cancel"
              onPress={() => {
                LayoutAnimation.easeInEaseOut();
                this.setState(getDefaultState(this.state.moneyInputKey + 1));
                this.props.collapse && this.props.collapse();
              }}
              style={[sharedStyles.button]}
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
                addTransaction({
                  date: this.state.date,
                  memo: this.state.memo,
                  amount: parseFloat(this.state.amount),
                  isCredit: this.state.isCredit,
                  vendor: this.state.vendor,
                });
                LayoutAnimation.easeInEaseOut();
                this.setState(getDefaultState(this.state.moneyInputKey + 1));
                this.props.collapse && this.props.collapse();
              }}
              style={[sharedStyles.button]}
            />
          </View>,
        ]}
      </View>
    );
  }
}

const sharedStyles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: theme.colors.backgroundColor,
    borderRadius: 10,
  },
  firstRow: {
    flexDirection: 'row',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
  },
  amountInput: {
    flex: 1,
    fontSize: 26,
    textAlign: 'right',
    fontWeight: '500',
  },
  secondRow: {
    flex: 1,
    justifyContent: 'space-between',
  },
  vendorInput: {
    flex: 1,
    textAlign: 'left',
    fontSize: smallFontSize,
    fontWeight: '500',
    color: theme.colors.darkerGray,
  },
  memoInput: {
    flex: 1,
    textAlign: 'right',
    fontSize: smallFontSize,
    fontWeight: '500',
    color: theme.colors.darkerGray,
  },
  isCreditSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 12,
    justifyContent: 'space-between',
  },
  button: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 7,
    paddingBottom: 7,
  },
  row: {
    padding: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  borderBottom: {
    borderBottomColor: theme.colors.lighterGray,
    borderBottomWidth: 1,
  },
});

export default TransactionForm;
