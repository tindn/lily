import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  addDocument,
  deleteDocument,
  updateDocument,
} from '../../../firebaseHelper';
import theme from '../../theme';
import DateInput from '../../components/dateInput';
import MoneyInput from '../../components/moneyInput';
import OutlineButton from '../../components/outlineButton';
import sharedStyles from '../../sharedStyles';

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
        balance: props.account.balance,
      };
    }
  }

  onBalancePressed = () => {
    this.setState(function(state) {
      return {
        isBalanceUpdate: !state.isBalanceUpdate,
        memo: state.isBalanceUpdate ? '' : 'Balance update',
      };
    });
  };

  updateType = val => {
    this.setState({ type: val ? 'credit' : 'debit' });

    if (this.state.isBalanceUpdate) {
      this.setState({
        balance:
          this.props.account.balance + (val ? 1 : -1) * this.state.amount,
      });
    }
  };

  updateBalanceAmount = amount => {
    let diff = amount - this.props.account.balance;

    this.setState({
      balance: amount,
      amount: Math.abs(diff),
      type: diff < 0 ? 'debit' : 'credit',
    });
  };

  confirmDelete = () => {
    Alert.alert('Confirm', 'Do you want to delete this entry?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          deleteDocument('accountEntries', this.state.id);
          this.props.onCancel();
        },
        style: 'destructive',
      },
    ]);
  };

  save = () => {
    const { memo, amount, type, date, id, accountId } = this.state;
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
  };

  render() {
    const { memo, amount, type, date, id, balance } = this.state;
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
          style={[
            sharedStyles.formRow,
            sharedStyles.borderBottom,
            sharedStyles.formSwitchRow,
          ]}
        >
          <Text style={{ color: theme.colors.darkGray }}>{type}</Text>
          <Switch value={type === 'credit'} onValueChange={this.updateType} />
        </View>
        {this.state.isBalanceUpdate && (
          <View style={[sharedStyles.formRow, sharedStyles.borderBottom]}>
            <View style={{ justifyContent: 'center' }}>
              <Text style={{ color: theme.colors.darkGray }}>New balance</Text>
            </View>
            <MoneyInput
              onChange={this.updateBalanceAmount}
              amount={balance}
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
              onPress={this.confirmDelete}
              style={[sharedStyles.outlineButton]}
              color={theme.colors.red}
            />
          ) : (
            <OutlineButton
              label="Balance"
              onPress={this.onBalancePressed}
              style={[sharedStyles.outlineButton]}
              color="#000"
              labelElement={
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={{
                      color: '#000',
                    }}
                  >
                    Balance
                  </Text>
                  {this.state.fetchingPlaidBalance && <ActivityIndicator />}
                </View>
              }
            />
          )}
          <OutlineButton
            label={id ? 'Save' : 'Add'}
            onPress={this.save}
            style={[sharedStyles.outlineButton]}
            color={id ? theme.colors.primary : theme.colors.iosBlue}
          />
        </View>
      </View>
    );
  }
}

export default AccountEntryForm;
