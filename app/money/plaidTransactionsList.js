import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { addDocument, getPlaidTransactions } from '../../firebaseHelper';
import theme from '../../theme';
import { formatAmountToDisplay } from '../../utils/money';

const WIDTH = Dimensions.get('window').width;

function PlaidTransactionsList(props) {
  const [loading, setLoading] = useState(false);
  function getPlaidTransactionsForAccount() {
    var endDate = new Date().toISOString().slice(0, 10);
    var startDate = new Date(Date.now() - 3600000 * 24 * 7)
      .toISOString()
      .slice(0, 10);

    setLoading(true);

    return getPlaidTransactions({
      accessToken: props.account.plaidAccessToken,
      accountId: props.account.plaidAccountId,
      startDate,
      endDate,
    })
      .then(function(result) {
        props.dispatch({
          type: 'ADD_PLAID_TRANSACTIONS',
          account: props.accountName,
          transactions: result.data.transactions,
        });
      })
      .finally(function() {
        setLoading(false);
      });
  }

  if (
    !loading &&
    (!props.plaidTransactions || !props.plaidTransactions.length)
  ) {
    getPlaidTransactionsForAccount();
  }

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
        {props.accountName}
      </Text>
      <FlatList
        data={props.plaidTransactions}
        keyExtractor={i => i.transaction_id}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={getPlaidTransactionsForAccount}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyComponent}>
            <Text>No transactions found.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const color = item.amount < 0 ? theme.colors.green : theme.colors.red;
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
                          date: new Date(`${item.date}T00:00:00.000-04:00`),
                          vendor: item.name,
                          amount: parseFloat(Math.abs(item.amount)),
                          entryType: item.amount < 0 ? 'credit' : 'debit',
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
                <Text style={styles.transactionItemDate}>{item.date}</Text>
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
}

function mapStateToProps(state, props) {
  return {
    plaidTransactions: state.plaidTransactions[props.accountName],
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
    width: WIDTH,
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
