import { useNavigation } from '@react-navigation/native';
import { Text } from 'components';
import React from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Swipeable from 'react-native-swipeable-row';
import SwipeToDeleteContent from '../../components/Swipeable/SwipeToDeleteContent';
import { deleteTransaction } from '../../db/transactions';
import { error, success } from '../../log';
import sharedStyles from '../../sharedStyles';
import { toWeekDayDateStringFromTimestamp } from '../../utils/date';
import { formatAmountToDisplay } from '../../utils/money';

export default function TransactionList(props) {
  const navigation = useNavigation();
  return (
    <FlatList
      data={props.data}
      keyExtractor={(item) => item.id}
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
            onRightActionRelease={function () {
              Alert.alert(
                'Confirm',
                'Do you want to delete this transaction?',
                [
                  {
                    text: 'Cancel',
                  },
                  {
                    text: 'Delete',
                    onPress: function () {
                      deleteTransaction(item)
                        .then(function () {
                          props.onTransactionDeleted &&
                            props.onTransactionDeleted(item);
                          props.fetchData && props.fetchData();
                          success('Transaction removed');
                        })
                        .catch(function (e) {
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
              style={sharedStyles.borderBottom}
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
            >
              <Text>{(item.memo || item.vendor).slice(0, 25)}</Text>
              <Text>{dateDisplay}</Text>
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
  transactionItemAmount: {
    textAlign: 'right',
  },
  transactionItemCategory: {
    textAlign: 'right',
  },
});
