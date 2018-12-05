import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import theme from '../../theme';
import {
  fetchTransactions,
  getTransactionsCollection,
  toDateString
} from '../../utils';

class TransactionList extends React.Component {
  state = {
    transactions: [],
    fetchingTransactionList: false
  };

  componentDidMount() {
    getTransactionsCollection().onSnapshot(this.getTransactions);
    this.getTransactions();
  }

  getTransactions = () => {
    let tenDaysAgo = new Date(Date.now() - 864000000);
    tenDaysAgo = new Date(
      tenDaysAgo.getFullYear(),
      tenDaysAgo.getMonth(),
      tenDaysAgo.getDate()
    );

    this.setState(
      function() {
        return {
          fetchingTransactionList: true
        };
      },
      function() {
        fetchTransactions([
          ['where', 'date', '>=', tenDaysAgo],
          ['orderBy', 'date', 'desc']
        ])
          .then(transactions => {
            this.setState({ transactions, fetchingTransactionList: false });
          })
          .catch(e => this.setState({ fetchingTransactionList: false }));
      }.bind(this)
    );
  };

  render() {
    return (
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity
          onPress={this.getTransactions}
          style={{
            padding: 7,
            backgroundColor: theme.colors.lighterGray,
            borderRadius: 5,
            width: 100,
            alignSelf: 'center',
            top: 7,
            zIndex: 1
          }}
        >
          <Text style={{ textAlign: 'center' }}>past 10 days</Text>
        </TouchableOpacity>
        <FlatList
          refreshing={this.state.fetchingTransactionList}
          onRefresh={() => {}}
          data={this.state.transactions}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <View
              style={{
                backgroundColor: '#fff',
                padding: 20,
                alignItems: 'center'
              }}
            >
              <Text>No transactions found.</Text>
            </View>
          }
          renderItem={({ item, index }) => {
            const borderBottomWidth =
              index === this.state.transactions.length - 1 ? 0 : 1;
            let dateDisplay = item.date;
            const color =
              item.entryType === 'debit'
                ? theme.colors.red
                : theme.colors.green;
            if (item.date.toDate) {
              dateDisplay = toDateString(item.date);
            }
            return (
              <View
                style={[
                  styles.transactionItem,
                  { borderBottomWidth: borderBottomWidth }
                ]}
              >
                <View>
                  <Text style={styles.transactionItemMemo}>{item.memo}</Text>
                  <Text style={styles.transactionItemDate}>{dateDisplay}</Text>
                </View>
                <Text style={[styles.transactionItemAmount, { color }]}>
                  $ {item.amount.toFixed(2)}
                </Text>
              </View>
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  transactionItem: {
    backgroundColor: '#fff',
    borderBottomColor: theme.colors.lighterGray,
    flex: 1,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  transactionItemMemo: {
    fontSize: 18,
    marginBottom: 8
  },
  transactionItemDate: {
    color: theme.colors.darkGray
  },
  transactionItemAmount: {
    fontSize: 20,
    fontWeight: '500'
  }
});

export default TransactionList;
