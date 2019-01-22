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
import { addTransaction } from '../../utils';
import OutlineButton from '../outlineButton';
import DateInput from '../dateInput';
import MoneyInput from '../moneyInput';
import sharedStyles from '../sharedStyles';

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
      <View style={sharedStyles.formContainer}>
        {this.props.isExpanded && [
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
              style={{ flex: 9 }}
            />
            <MoneyInput
              style={{ flex: 10 }}
              onChange={amount => this.setState({ amount })}
              key={this.state.moneyInputKey}
              amount={this.state.amount}
              editable={true}
            />
          </View>,
          <View
            key="secondRow"
            style={[sharedStyles.formRow, styles.borderBottom]}
          >
            <TextInput
              key="vendorInput"
              style={[sharedStyles.formTextInput, styles.vendorInput]}
              value={this.state.vendor}
              placeholder="vendor"
              onChangeText={text => this.setState({ vendor: text })}
            />
            <TextInput
              key="memoInput"
              style={[sharedStyles.formTextInput, styles.memoInput]}
              value={this.state.memo}
              placeholder="memo"
              onChangeText={text => this.setState({ memo: text })}
            />
          </View>,
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
          </View>,
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
              style={[sharedStyles.outlineButton]}
            />
          </View>,
        ]}
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

export default TransactionForm;
