import React, { useCallback, useState } from 'react';
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
import { NavigationEvents } from 'react-navigation';
import Screen from '../../components/screen';
import {
  deleteTransaction,
  getTransactionsBetweenTimestamps,
} from '../../db/transactions';
import { error, success } from '../../log';
import theme from '../../theme';
import {
  getMonthStartEndFor,
  toWeekDayDateStringFromTimestamp,
} from '../../utils/date';
import { formatAmountToDisplay } from '../../utils/money';
import OutlineButton from '../../components/outlineButton';

function MonthTransactions(props) {
  const [data, setData] = useState([]);
  var [refreshing, setRefreshing] = useState(false);
  var date = props.navigation.getParam('date', new Date());
  var fetchData = useCallback(
    function(params = { useLoadingIndicator: true }) {
      params.useLoadingIndicator && setRefreshing(true);
      var [start, end] = getMonthStartEndFor(date);
      getTransactionsBetweenTimestamps(start.getTime(), end.getTime())
        .then(setData)
        .finally(() => {
          params.useLoadingIndicator && setRefreshing(false);
        });
    },
    [date.getTime()]
  );

  return (
    <Screen>
      <NavigationEvents
        onWillFocus={function() {
          fetchData();
        }}
      />
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
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
                            fetchData();
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
              rightContent={
                <View
                  key={`delete ${item.id}`}
                  style={{
                    backgroundColor: theme.colors.red,
                    justifyContent: 'center',
                    flex: 1,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: '500',
                      fontSize: 18,
                      color: theme.colors.white,
                      paddingLeft: 10,
                    }}
                  >
                    Delete
                  </Text>
                </View>
              }
            >
              <TouchableOpacity
                delayPressIn={100}
                style={styles.transactionItem}
                onPress={() => {
                  props.navigation.navigate('TransactionDetails', {
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
                {item.category ? (
                  <OutlineButton
                    label={item.category}
                    style={{ paddingHorizontal: 7, paddingVertical: 3 }}
                    disabled
                  />
                ) : null}
                <Text style={[styles.transactionItemAmount, { color }]}>
                  {formatAmountToDisplay(item.amount)}
                </Text>
              </TouchableOpacity>
            </Swipeable>
          );
        }}
      />
    </Screen>
  );
}

MonthTransactions.navigationOptions = {
  headerTitle: new Date().toLocaleDateString('en-US', {
    month: 'long',
  }),
};

export default MonthTransactions;

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
  },
  transactionItemDate: {
    color: theme.colors.darkGray,
  },
  transactionItemMemo: {
    fontSize: 18,
    marginBottom: 8,
  },
});
