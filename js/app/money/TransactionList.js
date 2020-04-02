import { useNavigation } from '@react-navigation/native';
import { List, ListItem, Text } from '@ui-kitten/components';
import React from 'react';
import { Alert, RefreshControl, StyleSheet, View } from 'react-native';
import Swipeable from 'react-native-swipeable-row';
import SwipeToDeleteContent from '../../components/Swipeable/SwipeToDeleteContent';
import { deleteTransaction } from '../../db/transactions';
import { error, success } from '../../log';
import theme from '../../theme';
import { toWeekDayDateStringFromTimestamp } from '../../utils/date';
import { formatAmountToDisplay } from '../../utils/money';

export default function TransactionList(props) {
  const navigation = useNavigation();
  return (
    <List
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
            <ListItem
              style={styles.transactionItem}
              title={(item.memo || item.vendor).slice(0, 25)}
              description={dateDisplay}
              accessory={() => (
                <View>
                  <Text
                    status={item.entry_type == 'credit' ? 'success' : 'danger'}
                    category="h6"
                    style={styles.transactionItemAmount}
                  >
                    {formatAmountToDisplay(item.amount)}
                  </Text>
                  <Text
                    appearance="hint"
                    category="p2"
                    style={styles.transactionItemCategory}
                  >
                    {item.category}
                  </Text>
                </View>
              )}
              onPress={() => {
                navigation.navigate('TransactionDetails', {
                  title: item.memo,
                  transaction: item,
                });
              }}
            />
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
    borderBottomColor: theme.colors.lighterGray,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  transactionItemAmount: {
    textAlign: 'right',
  },
  transactionItemCategory: {
    textAlign: 'right',
  },
});
