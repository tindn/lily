import React from 'react';
import {
  Alert,
  Button,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { deleteDocument, updateDocument } from '../../firebaseHelper';
import theme from '../../theme';
import DateInput from '../dateInput';
import MoneyInput from '../moneyInput';
import Screen from '../screen';
import sharedStyles from '../sharedStyles';

class TransactionDetails extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', 'Transaction Details'),
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

  state = {
    amount: undefined,
    date: undefined,
    entryType: '',
    memo: '',
    vendor: '',
    isFixed: false,
  };

  render() {
    return (
      <Screen>
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
        >
          <View
            style={[
              sharedStyles.inputRow,
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
            ]}
          >
            <DateInput
              onChange={date => this.setState({ date })}
              date={this.state.date}
              style={[{ alignItems: 'flex-end' }]}
            />
            <MoneyInput
              onChange={amount => this.setState({ amount })}
              amount={this.state.amount}
              editable={true}
            />
          </View>
          <TextInput
            key="vendorInput"
            style={[
              { textAlign: 'right', fontSize: 20, fontWeight: '500' },
              sharedStyles.inputRow,
            ]}
            value={this.state.vendor}
            placeholder="vendor"
            onChangeText={text => this.setState({ vendor: text })}
          />
          <TextInput
            key="memoInput"
            style={[
              { textAlign: 'right', fontSize: 20, fontWeight: '500' },
              sharedStyles.inputRow,
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
                alignItems: 'center',
              },
              sharedStyles.inputRow,
            ]}
          >
            <Text style={{ color: theme.colors.darkGray }}>Income?</Text>
            <Switch
              value={this.state.isCredit}
              onValueChange={val => {
                this.setState({ isCredit: val });
              }}
            />
          </View>
          <View
            key="fixedSwitch"
            style={[
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
              sharedStyles.inputRow,
            ]}
          >
            <Text style={{ color: theme.colors.darkGray }}>Fixed?</Text>
            <Switch
              value={this.state.isFixed}
              onValueChange={val => {
                this.setState({ isFixed: val });
              }}
            />
          </View>
          <View style={[{ marginTop: 40 }, sharedStyles.actionButton]}>
            <Button
              title="Save"
              onPress={() => {
                updateDocument('transactions', this.state.id, {
                  date: this.state.date,
                  memo: this.state.memo,
                  vendor: this.state.vendor,
                  amount: parseFloat(this.state.amount),
                  entryType: this.state.isCredit ? 'credit' : 'debit',
                  isFixed: this.state.isFixed,
                });
                this.props.navigation.pop();
              }}
            />
          </View>
          <View style={[sharedStyles.actionButton, { borderBottomWidth: 0 }]}>
            <Button
              title="Delete"
              onPress={() => {
                Alert.alert(
                  'Confirm',
                  'Do you want to delete this transaction?',
                  [
                    {
                      text: 'Cancel',
                      onPress: function() {},
                    },
                    {
                      text: 'Delete',
                      onPress: () => {
                        deleteDocument('transactions', this.state.id);
                        this.props.navigation.pop();
                      },
                      style: 'destructive',
                    },
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

export default TransactionDetails;
