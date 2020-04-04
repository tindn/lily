import { Text } from '@ui-kitten/components';
import React, { useCallback, useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import theme from '../theme';
import { formatAmountToDisplay } from '../utils/money';

function MoneyInput(props) {
  const onChangeText = useCallback(
    text => {
      if (text.length < 4) {
        text = text.padStart(4, '0');
      }
      let arr = text.split('');
      // adding decimal delimiter (.)
      arr.splice(arr.length - 2, 0, '.');
      if (props.onChange) {
        props.onChange(arr.join(''));
      }
    },
    [props.onChange]
  );

  var inputRef = useRef(null);

  return (
    <View style={props.style}>
      <TextInput
        ref={inputRef}
        style={{ display: 'none' }}
        keyboardType="number-pad"
        onChangeText={onChangeText}
        autoFocus={props.autoFocus}
        editable={props.editable}
        placeholderTextColor={theme.colors.lightGray}
      />
      <TouchableOpacity
        onPress={() => {
          inputRef && inputRef.current && inputRef.current.focus();
          props.onFocus && props.onFocus();
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
