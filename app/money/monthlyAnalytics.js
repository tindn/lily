import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import theme from '../../theme';
import { formatAmountToDisplay, toWeekDayDateString } from '../../utils';
import Screen from '../screen';

function MonthlyAnalytics(props) {
  const data = [];
  return (
    <Screen>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyComponent}>
            <Text>{props.emptyText || 'No data.'}</Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const borderBottomWidth = index === data.length - 1 ? 0 : 1;
          let dateDisplay = toWeekDayDateString(item.date);
          const color = item.isCredit ? theme.colors.green : theme.colors.red;
          return (
            <View style={[styles.transactionItem, { borderBottomWidth }]}>
              <View>
                <Text style={styles.transactionItemMemo}>{item.memo}</Text>
                <Text style={styles.transactionItemDate}>{dateDisplay}</Text>
              </View>
              <Text style={[styles.transactionItemAmount, { color }]}>
                {formatAmountToDisplay(item.amount)}
              </Text>
            </View>
          );
        }}
      />
    </Screen>
  );
}

export default React.memo(MonthlyAnalytics);

const styles = StyleSheet.create({
  emptyComponent: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
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
    alignItems: 'center',
  },
  transactionItemMemo: {
    fontSize: 18,
    marginBottom: 8,
  },
  transactionItemDate: {
    color: theme.colors.darkGray,
  },
  transactionItemAmount: {
    fontSize: 20,
    fontWeight: '500',
  },
});
