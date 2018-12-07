import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import theme from '../../theme';
import { toWeekDayDateString } from '../../utils';

function TransactionList(props) {
  const { data, refreshing, navigation } = props;
  return (
    <FlatList
      refreshing={refreshing}
      onRefresh={() => {}}
      data={data}
      keyExtractor={item => item.id}
      ListEmptyComponent={
        <View style={styles.emptyComponent}>
          <Text>{props.emptyText || 'No transactions found.'}</Text>
        </View>
      }
      renderItem={({ item, index }) => {
        const borderBottomWidth = index === data.length - 1 ? 0 : 1;
        let dateDisplay = toWeekDayDateString(item.date);
        const color = item.isCredit ? theme.colors.green : theme.colors.red;
        return (
          <TouchableOpacity
            style={[
              styles.transactionItem,
              { borderBottomWidth: borderBottomWidth }
            ]}
            onPress={() => {
              navigation.navigate('TransactionDetails', {
                title: item.memo,
                transaction: item
              });
            }}
          >
            <View>
              <Text style={styles.transactionItemMemo}>{item.memo}</Text>
              <Text style={styles.transactionItemDate}>{dateDisplay}</Text>
            </View>
            <Text style={[styles.transactionItemAmount, { color }]}>
              $ {item.amount.toFixed(2)}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  emptyComponent: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center'
  },
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

export default React.memo(TransactionList);
