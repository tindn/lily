import React from 'react';
import { Alert, Switch, Text, TextInput, View } from 'react-native';
import {
  addDocument,
  deleteDocument,
  updateDocument,
} from '../../firebaseHelper';
import theme from '../../theme';
import DateInput from '../dateInput';
import MoneyInput from '../moneyInput';
import OutlineButton from '../outlineButton';
import sharedStyles from '../sharedStyles';

class AccountEntryForm extends React.PureComponent {
  constructor(props) {
    super(props);
    if (props.entry) {
      this.state = {
        ...props.entry,
      };
    } else {
      this.state = {
        id: undefined,
        accountId: props.accountId,
        memo: '',
        amount: 0,
        type: 'credit',
        date: new Date(),
        isBalanceUpdate: false,
        balance: props.accountBalance,
      };
    }
  }

  render() {
    const { memo, amount, type, date, id, accountId, balance } = this.state;
    return (
      <View style={sharedStyles.formContainer}>
        <View
          style={[
            sharedStyles.formRow,
            sharedStyles.formFirstRow,
            sharedStyles.borderBottom,
          ]}
        >
          <DateInput
            onChange={date => this.setState({ date })}
            date={date}
            style={{ flex: 9 }}
            mode="date"
          />
          <MoneyInput
            onChange={amount => this.setState({ amount })}
            amount={amount}
            textStyle={{
              flex: 10,
              color: type === 'debit' ? theme.colors.red : theme.colors.green,
            }}
          />
        </View>
        <View style={[sharedStyles.formRow, sharedStyles.borderBottom]}>
          <TextInput
            value={memo}
            style={[sharedStyles.formTextInput, { textAlign: 'right' }]}
            onChangeText={text => this.setState({ memo: text })}
          />
        </View>
        <View
          key="creditSwitch"
          style={[sharedStyles.formRow, sharedStyles.formSwitchRow]}
        >
          <Text style={{ color: theme.colors.darkGray }}>{type}</Text>
          <Switch
            value={type === 'credit'}
            onValueChange={val =>
              this.setState({ type: val ? 'credit' : 'debit' })
            }
          />
        </View>
        {this.state.isBalanceUpdate && (
          <View style={[sharedStyles.formRow, sharedStyles.borderBottom]}>
            <View />
            <MoneyInput
              onChange={amount => {
                let diff = amount - this.props.accountBalance;

                this.setState({
                  balance: amount,
                  amount: Math.abs(diff),
                  type: diff < 0 ? 'debit' : 'credit',
                });
              }}
              amount={balance}
              style={{}}
              textStyle={{
                flex: 10,
              }}
            />
          </View>
        )}
        <View key="buttons" style={sharedStyles.formButtons}>
          <OutlineButton
            label="Cancel"
            onPress={this.props.onCancel}
            style={[sharedStyles.outlineButton]}
            color={theme.colors.darkGray}
          />
          {id ? (
            <OutlineButton
              label="Delete"
              onPress={() => {
                Alert.alert('Confirm', 'Do you want to delete this entry?', [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: function() {},
                  },
                  {
                    text: 'Delete',
                    onPress: () => {
                      deleteDocument('accountEntries', id);
                      this.props.onCancel();
                    },
                    style: 'destructive',
                  },
                ]);
              }}
              style={[sharedStyles.outlineButton]}
              color={theme.colors.red}
            />
          ) : (
            <OutlineButton
              label="Balance"
              onPress={() => {
                this.setState({ isBalanceUpdate: !this.state.isBalanceUpdate });
              }}
              style={[sharedStyles.outlineButton]}
              color="#000"
            />
          )}
          <OutlineButton
            label={id ? 'Save' : 'Add'}
            onPress={() => {
              const entry = {
                date,
                memo,
                amount: parseFloat(amount),
                type,
                accountId,
              };
              if (id) {
                updateDocument('accountEntries', id, entry);
              } else {
                addDocument('accountEntries', entry);
              }
              this.props.onCancel();
            }}
            style={[sharedStyles.outlineButton]}
            color={id ? theme.colors.primary : theme.colors.iosBlue}
          />
        </View>
      </View>
    );
  }
}

export default AccountEntryForm;