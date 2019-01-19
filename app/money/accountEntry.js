import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { toWeekDayDateString, formatAmountToDisplay } from '../../utils';
import theme from '../../theme';

class AccountEntry extends React.PureComponent {
  static getDerivedStateFromProps(props, state) {
    if (!state.id) {
      return {
        ...props.entry,
      };
    }
    return null;
  }

  state = {
    expanded: false,
  };

  render() {
    const { memo, amount, type, date } = this.props.entry;
    const dateDisplay = toWeekDayDateString(date);
    const color = type === 'credit' ? theme.colors.green : theme.colors.red;
    return (
      <View>
        {!this.state.expanded && (
          <TouchableOpacity
            onPress={() => this.setState({ expanded: !this.state.expanded })}
            style={styles.transactionItem}
          >
            <View>
              <Text style={styles.transactionItemMemo}>{memo}</Text>
              <Text style={styles.transactionItemDate}>{dateDisplay}</Text>
            </View>
            <Text style={[styles.transactionItemAmount, { color }]}>
              {formatAmountToDisplay(amount)}
            </Text>
          </TouchableOpacity>
        )}
        {this.state.expanded && (
          <TouchableOpacity
            onPress={() => this.setState({ expanded: !this.state.expanded })}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.23,
              shadowRadius: 2.62,
              elevation: 4,
              marginLeft: 5,
              marginRight: 5,
              backgroundColor: theme.colors.backgroundColor,
              borderRadius: 10,
            }}
          >
            <Text>Form</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  transactionItem: {
    backgroundColor: theme.colors.backgroundColor,
    borderBottomColor: theme.colors.lighterGray,
    borderBottomWidth: 1,
    flex: 1,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  transactionItemMemo: {
    fontSize: 18,
    marginBottom: 8,
  },
  transactionItemDate: {
    color: theme.colors.darkGray,
  },
  transactionItemAmount: {
    fontSize: 20,
    fontWeight: '500',
  },
});

export default AccountEntry;
