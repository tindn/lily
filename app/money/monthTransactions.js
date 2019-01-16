import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import theme from '../../theme';
import { formatAmountToDisplay, toWeekDayDateString } from '../../utils';
import Screen from '../screen';

function MonthTransactions(props) {
  const { data } = props;
  return (
    <Screen>
      <FlatList
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
                { borderBottomWidth: borderBottomWidth },
              ]}
              onPress={() => {
                props.navigation.navigate('TransactionDetails', {
                  title: item.memo,
                  transaction: item,
                });
              }}
            >
              <View>
                <Text style={styles.transactionItemMemo}>
                  {item.memo || item.vendor}
                </Text>
                <Text style={styles.transactionItemDate}>{dateDisplay}</Text>
              </View>
              <Text style={[styles.transactionItemAmount, { color }]}>
                {formatAmountToDisplay(item.amount)}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </Screen>
  );
}

function mapStateToProps(state) {
  return {
    data: state.monthTransactions,
  };
}

export default connect(mapStateToProps)(React.memo(MonthTransactions));

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
