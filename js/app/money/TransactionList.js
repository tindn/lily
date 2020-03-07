import React from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Swipeable from 'react-native-swipeable-row';
import SwipeToDeleteContent from '../../components/Swipeable/SwipeToDeleteContent';
import { deleteTransaction } from '../../db/transactions';
import { error, success } from '../../log';
import theme from '../../theme';
import { toWeekDayDateStringFromTimestamp } from '../../utils/date';
import { formatAmountToDisplay } from '../../utils/money';
import navigation from '../navigation';

export default function TransactionList(props) {
  return (
    <FlatList
      data={props.data}
      keyExtractor={item => item.id}
      refreshControl={
        props.fetchData ? (
          <RefreshControl
            refreshing={props.isRefreshing}
            onRefresh={props.fetchData}
          />
        ) : null
      }
      ListEmptyComponent={
        <View style={styles.emptyComponent}>
          <Text>No transactions found.</Text>
        </View>
      }
      renderItem={({ item }) => {
        let dateDisplay = toWeekDayDateStringFromTimestamp(item.date_time);
        const color =
          item.entry_type == 'credit' ? theme.colors.green : theme.colors.red;
        return (
          <Swipeable
            rightActionActivationDistance={175}
            onRightActionRelease={function() {
              Alert.alert(
                'Confirm',
                'Do you want to delete this transaction?',
                [
                  {
                    text: 'Cancel',
                  },
                  {
                    text: 'Delete',
                    onPress: function() {
                      deleteTransaction(item)
                        .then(function() {
                          props.onTransactionDeleted &&
                            props.onTransactionDeleted(item);
                          props.fetchData && props.fetchData();
                          success('Transaction removed');
                        })
                        .catch(function(e) {
                          error('Failed to remove transaction', e);
                        });
                    },
                    style: 'destructive',
                  },
                ]
              );
            }}
            rightContent={<SwipeToDeleteContent />}
          >
            <TouchableOpacity
              delayPressIn={100}
              style={styles.transactionItem}
              onPress={() => {
                navigation.navigate('TransactionDetails', {
                  title: item.memo,
                  transaction: item,
                });
              }}
            >
              <View>
                <Text style={styles.transactionItemMemo}>
                  {(item.memo || item.vendor).slice(0, 25)}
                </Text>
                <Text style={styles.transactionItemDate}>{dateDisplay}</Text>
              </View>
              <View>
                <Text style={[styles.transactionItemAmount, { color }]}>
                  {formatAmountToDisplay(item.amount)}
                </Text>
                <Text style={styles.transactionItemCategory}>
                  {item.category}
                </Text>
              </View>
            </TouchableOpacity>
          </Swipeable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  emptyComponent: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  transactionItem: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundColor,
    borderBottomColor: theme.colors.lighterGray,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
  },
  transactionItemAmount: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'right',
  },
  transactionItemCategory: {
    color: theme.colors.darkGray,
    fontStyle: 'italic',
    textAlign: 'right',
  },
  transactionItemDate: {
    color: theme.colors.darkGray,
  },
  transactionItemMemo: {
    fontSize: 18,
    marginBottom: 8,
  },
});
