import React from 'react';
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from 'react-native';
import theme from '../../theme';
import { updateTransaction, deleteTransaction } from '../../utils';
import DateInput from '../dateInput';
import MoneyInput from '../moneyInput';
import Screen from '../screen';

class TransactionDetails extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', 'Transaction Details')
    };
  };

  static getDerivedStateFromProps(props, state) {
    if (state.date) {
      return null;
    }
    const transaction = props.navigation.getParam('transaction');
    if (!transaction) {
      return null;
    }
    return transaction;
  }

  state = {};

  render() {
    return (
      <Screen>
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
        >
          <DateInput
            onChange={date => this.setState({ date })}
            date={this.state.date}
            style={[{ alignItems: 'flex-end' }, sharedStyles.inputRow]}
          />
          <MoneyInput
            onChange={amount => this.setState({ amount })}
            amount={this.state.amount}
            style={sharedStyles.inputRow}
          />
          <TextInput
            key="memoInput"
            style={[
              { textAlign: 'right', fontSize: 20, fontWeight: '500' },
              sharedStyles.inputRow
            ]}
            value={this.state.memo}
            placeholder="memo"
            onChangeText={text => this.setState({ memo: text })}
          />
          <View
            key="creditSwitch"
            style={[
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              },
              sharedStyles.inputRow
            ]}
          >
            <Text style={{ color: theme.colors.darkGray }}>Income</Text>
            <Switch
              value={this.state.isCredit}
              onValueChange={val => {
                console.log(val);
                this.setState({ isCredit: val });
              }}
            />
          </View>
          <View style={[{ marginTop: 40 }, sharedStyles.inputRow]}>
            <Button
              title="Save"
              onPress={() => {
                updateTransaction({
                  id: this.state.id,
                  date: this.state.date,
                  memo: this.state.memo,
                  amount: parseFloat(this.state.amount),
                  isCredit: this.state.isCredit
                });
                this.props.navigation.pop();
              }}
            />
          </View>
          <View style={[sharedStyles.inputRow, { borderBottomWidth: 0 }]}>
            <Button
              title="Delete"
              onPress={() => {
                Alert.alert(
                  'Confirm',
                  'Do you want to delete this transaction?',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed')
                    },
                    {
                      text: 'Delete',
                      onPress: () => {
                        deleteTransaction(this.state.id);
                        this.props.navigation.pop();
                      },
                      style: 'destructive'
                    }
                  ]
                );
              }}
              color={theme.colors.red}
            />
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

const sharedStyles = StyleSheet.create({
  inputRow: {
    padding: 12,
    backgroundColor: '#fff',
    borderBottomColor: theme.colors.lighterGray,
    borderBottomWidth: 1
  }
});

export default TransactionDetails;
