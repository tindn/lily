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
import Icon from 'react-native-vector-icons/AntDesign';
import { NavigationEvents } from 'react-navigation';
import { toWeekDayDateStringFromTimestamp } from '../../utils/date';
import { formatAmountToDisplay } from '../../utils/money';
import Screen from '../../components/screen';
import {
  deleteTransaction,
  getTransactionsFromDate,
} from '../../db/transactions';
import { error, success } from '../../log';
import theme from '../../theme';

function MonthTransactions(props) {
  const [data, setData] = useState([]);
  var [refreshing, setRefreshing] = useState(false);
  var fetchData = useCallback(function(params = { useLoadingIndicator: true }) {
    const today = new Date();
    const startOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    ).getTime();
    params.useLoadingIndicator && setRefreshing(true);
    getTransactionsFromDate(startOfMonth)
      .then(setData)
      .finally(() => {
        params.useLoadingIndicator && setRefreshing(false);
      });
  }, []);

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
              rightButtons={[
                <TouchableOpacity
                  key={`delete ${item.id}`}
                  onPress={function() {
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
                </TouchableOpacity>,
              ]}
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
                    {unescape(item.memo || item.vendor).slice(0, 25)}
                  </Text>
                  <Text style={styles.transactionItemDate}>{dateDisplay}</Text>
                </View>
                {!item.is_discretionary && (
                  <View
                    style={{
                      backgroundColor: theme.colors.lighterGray,
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: theme.colors.lightGray,
                      padding: 5,
                    }}
                  >
                    <Text style={{ color: theme.colors.lightGray }}>FIXED</Text>
                  </View>
                )}
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

MonthTransactions.navigationOptions = ({ navigation }) => ({
  headerTitle: new Date().toLocaleDateString('en-US', {
    month: 'long',
  }),
  headerRight: (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('MonthSetup');
      }}
      style={{ marginRight: 10 }}
    >
      <Icon name="profile" size={25} color={theme.colors.primary} />
    </TouchableOpacity>
  ),
});

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
