import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '../../theme';

function SpendTracking(props) {
  const { spendingThisWeek, spendingThisMonth } = props;
  if (!spendingThisWeek && !spendingThisMonth) {
    return null;
  }
  return (
    <View
      style={{
        marginTop: 20,
        marginLeft: 8,
        marginRight: 8
      }}
    >
      <Text
        style={{
          fontWeight: '600',
          color: '#bbb',
          marginBottom: 8
        }}
      >
        Spent
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <Text style={sharedStyles.spendAmount}>
          $ {spendingThisWeek || 'N/A'} this week
        </Text>
        <TouchableOpacity onPress={this.updateSpendings}>
          <Text style={sharedStyles.spendAmount}>
            $ {spendingThisMonth || 'N/A'} this month
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const sharedStyles = StyleSheet.create({
  spendAmount: {
    fontWeight: '600',
    color: theme.colors.darkGray,
    fontSize: 16
  }
});

export default React.memo(SpendTracking);
