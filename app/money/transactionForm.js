import React from 'react';
import {
  DatePickerIOS,
  LayoutAnimation,
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
import MoneyInput from '../moneyInput';

const smallFontSize = 20;
const inputBorderColor = theme.colors.lighterGray;

function getDefaultState(moneyInputKey) {
  return {
    date: new Date(),
    memo: '',
    amount: 0,
    isCredit: false,
    dateModalVisible: false,
    isExpanded: false,
    moneyInputKey: moneyInputKey || 0
  };
}

class TransactionForm extends React.Component {
  state = getDefaultState();

  render() {
    return (
      <View style={sharedStyles.container}>
        <TouchableOpacity
          onPress={() => {
            LayoutAnimation.easeInEaseOut();
            this.setState({ isExpanded: true });
          }}
          style={sharedStyles.firstRow}
        >
          <View>
            <TouchableOpacity
              onPress={() => this.setState({ dateModalVisible: true })}
            >
              <Text
                style={sharedStyles.dateText}
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
              <View style={sharedStyles.datePickerModal}>
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
            <MoneyInput
              onFocus={() => {
                if (!this.state.isExpanded) {
                  LayoutAnimation.easeInEaseOut();
                  this.setState({ isExpanded: true });
                }
              }}
              onChange={amount => this.setState({ amount })}
              key={this.state.moneyInputKey}
            />
          </View>
        </TouchableOpacity>
        {this.state.isExpanded && [
          <TextInput
            key="memoInput"
            style={sharedStyles.memoInput}
            value={this.state.memo}
            placeholder="memo"
            onChangeText={text => this.setState({ memo: text })}
          />,
          <View key="creditSwitch" style={sharedStyles.isCreditSwitch}>
            <Text style={{ color: theme.colors.darkGray }}>Income</Text>
            <Switch
              value={this.state.isCredit}
              onValueChange={val => this.setState({ isCredit: val })}
            />
          </View>,
          <View key="buttons" style={sharedStyles.buttonContainer}>
            <Button
              label="Cancel"
              onPress={() => {
                LayoutAnimation.easeInEaseOut();
                this.setState(getDefaultState(this.state.moneyInputKey + 1));
              }}
              style={[sharedStyles.button]}
              color={theme.colors.darkGray}
            />
            <Button
              color={theme.colors.primary}
              disabled={
                this.state.amount === '$ 00.00' || this.state.memo === ''
              }
              label="Add"
              onPress={() => {
                addTransaction({
                  date: this.state.date,
                  memo: this.state.memo,
                  amount: parseFloat(this.state.amount),
                  isCredit: this.state.isCredit
                });
                LayoutAnimation.easeInEaseOut();
                this.setState(getDefaultState(this.state.moneyInputKey + 1));
              }}
              style={[sharedStyles.button]}
            />
          </View>
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
    marginTop: 5,
    backgroundColor: theme.colors.backgroundColor,
    borderRadius: 10
  },
  firstRow: {
    flexDirection: 'row',
    borderBottomColor: inputBorderColor,
    borderBottomWidth: 1,
    padding: 12,
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center'
  },
  dateText: {
    flex: 9,
    fontSize: smallFontSize,
    color: theme.colors.darkGray,
    fontWeight: '500'
  },
  datePickerModal: {
    backgroundColor: '#fff',
    top: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4
  },
  amountInput: {
    flex: 1,
    fontSize: 26,
    textAlign: 'right',
    fontWeight: '500'
  },
  memoInput: {
    flex: 1,
    textAlign: 'right',
    fontSize: smallFontSize,
    fontWeight: '500',
    padding: 12,
    borderBottomColor: inputBorderColor,
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    color: theme.colors.darkerGray
  },
  isCreditSwitch: {
    backgroundColor: '#fff',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 12,
    justifyContent: 'space-between'
  },
  button: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 7,
    paddingBottom: 7
  }
});

export default TransactionForm;
