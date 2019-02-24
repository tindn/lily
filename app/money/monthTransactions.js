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
import { queryData } from '../../firebaseHelper';
import theme from '../../theme';
import { toWeekDayDateString } from '../../utils/date';
import { formatAmountToDisplay } from '../../utils/money';
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
    this.startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.state = {
      refreshing: false,
      data: [],
    };
  }

  fetchData = () => {
    this.setState({ refreshing: true });
    queryData('transactions', [
      ['where', 'date', '>=', this.startOfMonth],
      ['orderBy', 'date', 'desc'],
    ])
      .then(this.props.updateMonthTransactions)
      .finally(() => {
        this.setState({
          refreshing: false,
        });
      });
  };

  render() {
    return (
      <Screen>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.fetchData}
            />
          }
          data={this.state.data}
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

export default connect(mapStateToProps)(React.memo(MonthTransactions));

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
    flex: 1,
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
