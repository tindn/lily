import firebase from 'firebase';
import React from 'react';
import { Alert, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import theme from '../../theme';
import DateInput from '../dateInput';
import MoneyInput from '../moneyInput';
import OutlineButton from '../outlineButton';
import sharedStyles from '../sharedStyles';

class AccountEntryForm extends React.PureComponent {
  constructor(props) {
    super(props);
    if (props.entry) {
      this.state = { ...props.entry };
    } else {
      this.state = {
        id: undefined,
        accountId: props.accountId,
        memo: '',
        amount: 0,
        type: 'debit',
        date: new Date(),
      };
    }
  }

  render() {
    const { memo, amount, type, date, id, accountId } = this.state;
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
        <View key="buttons" style={sharedStyles.formButtons}>
          <OutlineButton
            label="Cancel"
            onPress={this.props.onCancel}
            style={[sharedStyles.outlineButton]}
            color={theme.colors.darkGray}
          />
          {id && (
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
                      firebase
                        .firestore()
                        .collection('accountEntries')
                        .doc(id)
                        .delete();
                      this.props.onCancel();
                    },
                    style: 'destructive',
                  },
                ]);
              }}
              style={[sharedStyles.outlineButton]}
              color={theme.colors.red}
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
                _updatedOn: new Date(),
              };
              const accountEntries = firebase
                .firestore()
                .collection('accountEntries');
              if (id) {
                accountEntries.doc(id).update(entry);
              } else {
                accountEntries.add(entry);
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
