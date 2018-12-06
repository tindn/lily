import React from 'react';
import {
  DatePickerIOS,
  Modal,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import theme from '../../theme';
import { addTransaction, toDateString } from '../../utils';
import Button from '../button';

const amountRegex = /^\$\s[0]*([1-9]*)\.*(\d*)$/;
const smallFontSize = 20;
const largeFontSize = 26;
const inputBorderColor = theme.colors.lighterGray;
const defaultState = {
  date: new Date(),
  memo: '',
  amount: '$ 00.00',
  isCredit: false,
  dateModalVisible: false
};
class TransactionForm extends React.Component {
  state = { ...defaultState };

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
          <View>
            <TouchableOpacity
              onPress={() => this.setState({ dateModalVisible: true })}
            >
              <Text
                style={{
                  flex: 9,
                  fontSize: smallFontSize,
                  color: theme.colors.darkGray,
                  fontWeight: '500'
                }}
                onChangeText={text => this.setState({ date: text })}
                keyboardType="decimal-pad"
              >
                {toDateString(this.state.date)}
              </Text>
            </TouchableOpacity>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.dateModalVisible}
            >
              <View
                style={{
                  backgroundColor: '#fff',
                  top: 10,
                  padding: 20,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.23,
                  shadowRadius: 2.62,
                  elevation: 4
                }}
              >
                <DatePickerIOS
                  mode="date"
                  date={this.state.date}
                  onDateChange={date => this.setState({ date })}
                />
                <Button
                  onPress={() => {
                    this.setState({ dateModalVisible: false });
                  }}
                  label="Done"
                  color={theme.colors.primary}
                  style={{
                    width: 100,
                    alignSelf: 'center',
                    padding: 5
                  }}
                  textStyle={{ textAlign: 'center' }}
                />
              </View>
            </Modal>
          </View>
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
            color={theme.colors.primary}
            disabled={this.state.amount === '$ 00.00' || this.state.memo === ''}
            label="Add"
            onPress={() => {
              addTransaction({
                date: this.state.date,
                memo: this.state.memo,
                amount: this.state.amount,
                isCredit: this.state.isCredit
              });
              this.setState({ ...defaultState });
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
