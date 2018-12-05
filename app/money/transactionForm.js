import React from 'react';
import { View, TextInput, StyleSheet, Switch, Text } from 'react-native';
import firebase from 'firebase';
import Button from '../button';
import { toDateString } from '../../utils';
import theme from '../../theme';

const amountRegex = /^\$\s[0]*([1-9]*)\.*(\d*)$/;
const smallFontSize = 20;
const largeFontSize = 26;
const inputBorderColor = theme.colors.lighterGray;
const defaultState = {
  date: toDateString(new Date()),
  memo: '',
  amount: '$ 00.00',
  isCredit: false
};
class TransactionForm extends React.Component {
  state = { ...defaultState };

  componentDidMount() {
    this.db = firebase.firestore();
  }

  onChangeText = text => {
    // need to determine recent changes (.ie backspace vs. number)
    // unable to use onKeyPress because of RN bug
    const matches = amountRegex.exec(text);
    if (text.length > this.state.amount.length) {
      if (matches) {
        let leftPart = matches[1].concat(matches[2].substring(0, 1));
        leftPart = leftPart.padStart(2, '0');
        let rightPart = matches[2].substring(1);
        this.setState({ amount: '$ ' + leftPart + '.' + rightPart });
      }
    }
    if (text.length < this.state.amount.length) {
      if (matches) {
        let leftPart = matches[1].substring(0, matches[1].length - 1);
        leftPart = leftPart.padStart(2, '0');
        let rightPart = matches[1].slice(-1).concat(matches[2]);
        rightPart = rightPart.padStart(2, '0');
        this.setState({ amount: '$ ' + leftPart + '.' + rightPart });
      }
    }
  };

  render() {
    return (
      <View
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,
          elevation: 4,
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          backgroundColor: theme.colors.backgroundColor,
          borderRadius: 10
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: inputBorderColor,
            borderBottomWidth: 1,
            padding: 12,
            backgroundColor: '#fff',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10
          }}
        >
          <TextInput
            style={{
              flex: 9,
              fontSize: smallFontSize,
              color: theme.colors.darkGray,
              fontWeight: '500'
            }}
            value={this.state.date}
            onChangeText={text => this.setState({ date: text })}
            keyboardType="decimal-pad"
          />
          <View style={{ flex: 10, flexDirection: 'row' }}>
            <TextInput
              value={this.state.amount}
              keyboardType="number-pad"
              onChangeText={this.onChangeText}
              style={{
                flex: 1,
                fontSize: largeFontSize,
                textAlign: 'right',
                fontWeight: '500'
              }}
            />
          </View>
        </View>
        <TextInput
          value={this.state.memo}
          placeholder="memo"
          style={{
            flex: 1,
            textAlign: 'right',
            fontSize: smallFontSize,
            fontWeight: '500',
            padding: 12,
            borderBottomColor: inputBorderColor,
            borderBottomWidth: 1,
            backgroundColor: '#fff',
            color: theme.colors.darkerGray
          }}
          onChangeText={text => this.setState({ memo: text })}
        />
        <View
          style={{
            backgroundColor: '#fff',
            padding: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Text style={{ color: theme.colors.darkGray }}>Income</Text>
          <Switch
            value={this.state.isCredit}
            onValueChange={val => this.setState({ isCredit: val })}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            padding: 12,
            justifyContent: 'space-between'
          }}
        >
          <Button
            label="Cancel"
            onPress={() => this.setState({ ...defaultState })}
            style={[sharedStyles.button]}
            color={theme.colors.darkGray}
          />
          <Button
            disabled={this.state.amount === '$ 00.00' || this.state.memo === ''}
            label="Add"
            onPress={() => {
              this.db
                .collection('transactions')
                .add({
                  date: new Date(this.state.date),
                  memo: this.state.memo,
                  amount: parseFloat(this.state.amount.substring(2)),
                  entryType: this.state.isCredit ? 'credit' : 'debit',
                  _addedOn: firebase.firestore.FieldValue.serverTimestamp()
                })
                .then(docRef => this.setState({ ...defaultState }))
                .catch(function(error) {
                  console.log('Error adding document: ', error);
                });
            }}
            style={[sharedStyles.button]}
          />
        </View>
      </View>
    );
  }
}

const sharedStyles = StyleSheet.create({
  button: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 7,
    paddingBottom: 7
  }
});

export default TransactionForm;
