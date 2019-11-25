import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import theme from '../../../theme';

export default function TransactionAdd(props) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        backgroundColor: theme.colors.primary,
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
      }}
    >
      <Text style={{ color: theme.colors.secondary, fontSize: 16 }}>Add</Text>
    </TouchableOpacity>
  );
}
