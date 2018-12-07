import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const amountRegex = /^\$\s[0]*([1-9]*)\.*(\d*)$/;

class MoneyInput extends React.PureComponent {
  state = {
    amount: '$ 00.00'
  };

  onChangeText = text => {
    // need to determine recent changes (.ie backspace vs. number)
    // unable to use onKeyPress because of RN bug
    const matches = amountRegex.exec(text);
    if (!matches) {
      return;
    }

    let leftPart, rightPart;
    if (text.length > this.state.amount.length) {
      leftPart = matches[1].concat(matches[2].substring(0, 1));
      leftPart = leftPart.padStart(2, '0');
      rightPart = matches[2].substring(1);
    }

    if (text.length < this.state.amount.length) {
      leftPart = matches[1].substring(0, matches[1].length - 1);
      leftPart = leftPart.padStart(2, '0');
      rightPart = matches[1].slice(-1).concat(matches[2]);
      rightPart = rightPart.padStart(2, '0');
    }

    const newAmount = leftPart + '.' + rightPart;
    this.setState({ amount: '$ ' + newAmount });
    if (this.props.onChange) {
      this.props.onChange(parseFloat(newAmount));
    }
  };

  render() {
    return (
      <TextInput
        style={styles.input}
        value={this.state.amount}
        keyboardType="number-pad"
        onChangeText={this.onChangeText}
        onFocus={this.props.onFocus}
      />
    );
  }
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    fontSize: 26,
    textAlign: 'right',
    fontWeight: '500'
  }
});

export default MoneyInput;
