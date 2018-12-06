import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import theme from '../../theme';
import { toDateString } from '../../utils';

function TransactionList(props) {
  const { data, refreshing } = props;
  return (
    <FlatList
      refreshing={refreshing}
      onRefresh={() => {}}
      data={data}
      keyExtractor={item => item.id}
      ListEmptyComponent={
        <View style={styles.emptyComponent}>
          <Text>No transactions found.</Text>
        </View>
      }
      renderItem={({ item, index }) => {
        const borderBottomWidth = index === data.length - 1 ? 0 : 1;
        let dateDisplay = item.date;
        const color =
          item.entryType === 'debit' ? theme.colors.red : theme.colors.green;
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
