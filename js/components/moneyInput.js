import { Text } from 'components';
import React, { useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import theme from '../theme';
import { formatAmountToDisplay } from '../utils/money';

function MoneyInput(props) {
  const inputRef = useRef();

  return (
    <View style={props.style}>
      <TextInput
        ref={inputRef}
        style={{ display: 'none' }}
        keyboardType="number-pad"
        onChangeText={text => {
          if (text.length < 4) {
            text = text.padStart(4, '0');
          }
          let arr = text.split('');
          // adding decimal delimiter (.)
          arr.splice(arr.length - 2, 0, '.');
          if (props.onChange) {
            props.onChange(arr.join(''));
          }
        }}
        autoFocus={props.autoFocus}
        editable={props.editable}
        placeholderTextColor={theme.colors.lightGray}
      />
      <TouchableOpacity
        onPress={() => {
          if (inputRef.current && inputRef.current.focus) {
            inputRef.current && inputRef.current.focus();
          }
          if (props.onFocus) {
            props.onFocus();
          }
        }}
      >
        <Text
          status={props.type === 'credit' ? 'success' : 'danger'}
          category="h5"
          style={[styles.display, props.textStyle]}
        >
          {formatAmountToDisplay(props.amount)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  display: {
    fontWeight: '500',
    textAlign: 'right',
  },
});

export default MoneyInput;
