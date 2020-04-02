import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { formatAmountToDisplay } from '../utils/money';
import theme from '../theme';

class MoneyInput extends React.PureComponent {
  onChangeText = text => {
    if (text.length < 4) {
      text = text.padStart(4, '0');
    }
    let arr = text.split('');
    // adding decimal delimiter (.)
    arr.splice(arr.length - 2, 0, '.');
    if (this.props.onChange) {
      this.props.onChange(arr.join(''));
    }
  };

  render() {
    return (
      <View style={this.props.style}>
        <TextInput
          ref={input => (this.textInput = input)}
          style={{ display: 'none' }}
          keyboardType="number-pad"
          onChangeText={this.onChangeText}
          autoFocus={this.props.autoFocus}
          editable={this.props.editable}
          placeholderTextColor={theme.colors.lightGray}
        />
        <TouchableOpacity
          onPress={() => {
            this.textInput && this.textInput.focus();
            this.props.onFocus && this.props.onFocus();
          }}
        >
          <Text
            status={this.props.type === 'credit' ? 'success' : 'danger'}
            category="h5"
            style={[styles.display, this.props.textStyle]}
          >
            {formatAmountToDisplay(this.props.amount)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  display: {
    fontWeight: '500',
    textAlign: 'right',
  },
});

export default MoneyInput;
