import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '../../theme';

function SpendTracking(props) {
  const { spendingThisWeek, spendingThisMonth } = props;
  if (!spendingThisWeek && !spendingThisMonth) {
    return null;
  }
  return (
    <View style={sharedStyles.container}>
      <Text style={sharedStyles.title}>Spent</Text>
      <View style={sharedStyles.row}>
        <Text style={sharedStyles.spendAmount}>
          $ {spendingThisWeek || 'N/A'} this week
        </Text>
        <Text style={sharedStyles.spendAmount}>
          $ {spendingThisMonth || 'N/A'} this month
        </Text>
      </View>
    </View>
  );
}

const sharedStyles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginLeft: 8,
    marginRight: 8
  },
  title: {
    fontWeight: '600',
    color: '#bbb',
    marginBottom: 8
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  spendAmount: {
    fontWeight: '600',
    color: theme.colors.darkGray,
    fontSize: 16
  }
});

export default React.memo(SpendTracking);
