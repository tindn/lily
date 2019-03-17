import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { getPlaidTransactions, addDocument } from '../../firebaseHelper';
import theme from '../../theme';
import { formatAmountToDisplay } from '../../utils/money';

var arr = ['Simple', 'JB Barclays', 'Amex Cash'];

class PlaidTransactionsList extends React.Component {
  state = {};

  getPlaidTransactions = () => {
    this.props.dispatch({ type: 'FETCH_PLAID_TRANSACTIONS_STARTED' });
    const plaidAccounts = Object.values(this.props.accounts).filter(function(
      account
    ) {
      return arr.includes(account.name);
    });

    var endDate = new Date().toISOString().slice(0, 10);

    var startDate = new Date(Date.now() - 1209600000)
      .toISOString()
      .slice(0, 10);

    Promise.all(
      plaidAccounts.map(
        function(account) {
          return getPlaidTransactions({
            accessToken: account.plaidAccessToken,
            accountId: account.plaidAccountId,
            startDate,
            endDate,
          }).then(
            function(result) {
              this.props.dispatch({
                type: 'ADD_PLAID_TRANSACTIONS',
                account: account.name,
                transactions: result.data.transactions,
              });
              return true;
            }.bind(this)
          );
        }.bind(this)
      )
    )
      .then(
        function() {
          this.props.dispatch({ type: 'FETCH_PLAID_TRANSACTIONS_COMPLETED' });
        }.bind(this)
      )
      .catch(
        function() {
          theme.props.dispatch({ type: 'FETCH_PLAID_TRANSACTIONS_FAILED' });
        }.bind(this)
      );
  };
  componentDidMount() {
    if (!Object.keys(this.props.plaidTransactions).length) {
      this.getPlaidTransactions();
    }
  }

  render() {
    return (
      <View style={{ height: 330 }}>
        {this.props.loadingPlaidTransactions && <ActivityIndicator />}
        <FlatList
          data={Object.entries(this.props.plaidTransactions)}
          keyExtractor={item => item[0]}
          horizontal={true}
          renderItem={({ item }) => {
            return (
              <View style={{ flexDirection: 'column' }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 15,
                    color: theme.colors.primary,
                    paddingTop: 5,
                  }}
                >
                  {item[0]}
                </Text>
                <FlatList
                  data={item[1]}
                  keyExtractor={item => item.transaction_id}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.props.loadingPlaidTransactions}
                      onRefresh={this.getPlaidTransactions}
                    />
                  }
                  ListEmptyComponent={
                    <View style={styles.emptyComponent}>
                      <Text>No transactions found.</Text>
                    </View>
                  }
                  renderItem={({ item }) => {
                    const color =
                      item.amount < 0 ? theme.colors.green : theme.colors.red;
                    return (
                      <TouchableOpacity
                        style={styles.transactionItem}
                        onPress={() => {
                          Alert.alert(
                            'Import Transaction',
                            `${item.name} \n${formatAmountToDisplay(
                              Math.abs(item.amount)
                            )}`,
                            [
                              {
                                text: 'Cancel',
                                onPress: () => {},
                                style: 'cancel',
                              },
                              {
                                text: 'OK',
                                onPress: () => {
                                  addDocument('transactions', {
                                    date: new Date(
                                      `${item.date}T00:00:00.000-04:00`
                                    ),
                                    vendor: item.name,
                                    amount: parseFloat(Math.abs(item.amount)),
                                    entryType:
                                      item.amount < 0 ? 'credit' : 'debit',
                                    _addedOn: new Date(),
                                  });
                                },
                              },
                            ],
                            { cancelable: false }
                          );
                        }}
                      >
                        <View style={{ flex: 3 }}>
                          <Text style={styles.transactionItemMemo}>
                            {item.name && item.name.slice(0, 25)}
                          </Text>
                          <Text style={styles.transactionItemDate}>
                            {item.date}
                          </Text>
                        </View>
                        <Text style={[styles.transactionItemAmount, { color }]}>
                          {formatAmountToDisplay(Math.abs(item.amount))}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            );
          }}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.accounts,
    plaidTransactions: state.plaidTransactions,
    loadingPlaidTransactions: state.loadingPlaidTransactions,
  };
}

export default connect(mapStateToProps)(PlaidTransactionsList);

const styles = StyleSheet.create({
  emptyComponent: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  transactionItem: {
    alignItems: 'center',
    borderBottomColor: theme.colors.lighterGray,
    borderBottomWidth: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    width: 375,
  },
  transactionItemAmount: {
    fontSize: 20,
    fontWeight: '500',
  },
  transactionItemDate: {
    color: theme.colors.darkGray,
  },
  transactionItemMemo: {
    flex: 1,
    fontSize: 14,
    marginBottom: 8,
  },
});
