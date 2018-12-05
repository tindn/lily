import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fetchTransactions, getTransactionsCollection } from '../../utils';
import theme from '../../theme';

class SpendTracking extends React.Component {
  state = {
    spendingLastWeek: null,
    spendingThisMonth: null
  };

  componentDidMount() {
    this.updateSpendings();
    getTransactionsCollection().onSnapshot(this.updateSpendings);
  }

  updateSpendings = () => {
    const today = new Date();
    const weekStartOffset = (today.getDay() - 1) * 86400000;
    const startOfWeek = new Date(Date.now() - weekStartOffset);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    fetchTransactions([
      ['where', 'date', '>=', startOfWeek],
      ['where', 'entryType', '==', 'debit']
    ])
      .then(weekTransactions => {
        this.setState({
          spendingLastWeek: weekTransactions
            .reduce((acc, curr) => {
              acc = acc + curr.amount;
              return acc;
            }, 0)

            .toFixed(2)
        });
      })
      .catch(e => console.log(e));

    fetchTransactions([
      ['where', 'date', '>=', startOfMonth],
      ['where', 'entryType', '==', 'debit']
    ]).then(monthTransactions => {
      this.setState({
        spendingThisMonth: monthTransactions
          .reduce((acc, curr) => {
            acc = acc + curr.amount;
            return acc;
          }, 0)

          .toFixed(2)
      });
    });
  };

  render() {
    if (!this.state.spendingLastWeek && !this.state.spendingThisMonth) {
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
            $ {this.state.spendingLastWeek || 'N/A'} last week
          </Text>
          <Text style={sharedStyles.spendAmount}>
            $ {this.state.spendingThisMonth || 'N/A'} this month
          </Text>
        </View>
      </View>
    );
  }
}

const sharedStyles = StyleSheet.create({
  spendAmount: {
    fontWeight: '600',
    color: theme.colors.darkGray,
    fontSize: 16
  }
});

export default SpendTracking;
