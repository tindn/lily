import firebase from 'firebase';
import React from 'react';
import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import theme from '../../theme';
import DateInput from '../dateInput';
import MoneyInput from '../moneyInput';
import OutlineButton from '../outlineButton';

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
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View key="1">
            <DateInput
              onChange={date => this.setState({ date })}
              date={date}
              style={styles.date}
              mode="date"
            />
            <TextInput
              value={memo}
              style={{ fontSize: 18, marginTop: 10 }}
              onChangeText={text => this.setState({ memo: text })}
            />
          </View>
          <View>
            <MoneyInput
              onChange={amount => this.setState({ amount })}
              amount={amount}
              textStyle={{
                fontSize: 20,
                color: type === 'debit' ? theme.colors.red : theme.colors.green,
              }}
            />
            <View
              key="creditSwitch"
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                marginTop: 10,
              }}
            >
              <Text style={{ color: theme.colors.darkGray, marginRight: 5 }}>
                Is debit
              </Text>
              <Switch
                value={type === 'debit'}
                onValueChange={val =>
                  this.setState({ type: val ? 'debit' : 'credit' })
                }
              />
            </View>
          </View>
        </View>

        <View key="buttons" style={styles.buttons}>
          <OutlineButton
            label="Cancel"
            onPress={this.props.onCancel}
            style={[styles.button]}
            color={theme.colors.darkGray}
          />
          {id && (
            <OutlineButton
              label="Delete"
              onPress={() => {
                firebase
                  .firestore()
                  .collection('accountEntries')
                  .doc(id)
                  .delete();
                this.props.onCancel();
              }}
              style={[styles.button]}
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
            style={[styles.button]}
            color={id ? theme.colors.primary : theme.colors.iosBlue}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    paddingBottom: 7,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 7,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  container: {
    backgroundColor: '#fff',
    paddingBottom: 20,
    paddingHorizontal: 7,
    paddingTop: 20,
  },
  date: {
    fontSize: 18,
    marginBottom: 8,
  },
});

export default AccountEntryForm;
