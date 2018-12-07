import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

class MoneyInput extends React.PureComponent {
  state = {
    amount: ''
  };

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

    // adding thousand (,) separator.
    // this doesn't add the million (or more) separator,
    // as it's unlikely for expenses to be that high.
    if (arr.length > 6) {
      arr.splice(arr.length - 6, 0, ',');
    }
    this.setState({ amount: arr.join('') });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <TextInput
          ref={input => (this.textInput = input)}
          style={{ display: 'none' }}
          keyboardType="number-pad"
          onChangeText={this.onChangeText}
        />
        <TouchableOpacity
          onPress={() => {
            this.textInput && this.textInput.focus();
            this.props.onFocus && this.props.onFocus();
          }}
        >
          <Text style={styles.display}>$ {this.state.amount || '00.00'}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  display: {
    flex: 1,
    fontSize: 26,
    textAlign: 'right',
    fontWeight: '500'
  }
});

export default MoneyInput;
