import React from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import theme from '../../theme';
import {
  formatAmountToDisplay,
  getTransactionsFromSnapshot,
  getTransactionsQuery,
  toWeekDayDateString,
} from '../../utils';
import Screen from '../screen';

class MonthTransactions extends React.PureComponent {
  static getDerivedStateFromProps(props) {
    if (props.data && props.data.length) {
      return { data: props.data };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.monthTransactionsQuery = getTransactionsQuery([
      ['where', 'date', '>=', startOfMonth],
      ['orderBy', 'date', 'desc'],
    ]);
    this.state = {
      refreshing: false,
      data: [],
    };
  }

  componentDidMount() {
    this.monthTransactionsQuery.onSnapshot(snapshot => {
      const transactions = getTransactionsFromSnapshot(snapshot);
      this.props.updateMonthTransactions(transactions);
    });
  }

  fetchData = () => {
    this.setState({ refreshing: true });
    this.monthTransactionsQuery
      .get()
      .then(getTransactionsFromSnapshot)
      .then(this.props.updateMonthTransactions)
      .finally(() => {
        this.setState({
          refreshing: false,
        });
      });
  };

  render() {
    const { data } = this.state;
    return (
      <Screen>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.fetchData}
            />
          }
          data={data}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <View style={styles.emptyComponent}>
              <Text>No transactions found.</Text>
            </View>
          }
          renderItem={({ item }) => {
            let dateDisplay = toWeekDayDateString(item.date);
            const color = item.isCredit ? theme.colors.green : theme.colors.red;
            return (
              <TouchableOpacity
                style={styles.transactionItem}
                onPress={() => {
                  this.props.navigation.navigate('TransactionDetails', {
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
}

function mapStateToProps(state) {
  return {
    data: state.monthTransactions,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateMonthTransactions(transactions) {
      dispatch({ type: 'UPDATE_MONTH_TRANSACTIONS', transactions });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(MonthTransactions));

const styles = StyleSheet.create({
  emptyComponent: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  transactionItem: {
    backgroundColor: theme.colors.backgroundColor,
    borderBottomColor: theme.colors.lighterGray,
    borderBottomWidth: 1,
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
