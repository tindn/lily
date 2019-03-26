import React from 'react';
import {
  FlatList,
  LayoutAnimation,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import { queryData } from '../../firebaseHelper';
import theme from '../../theme';
import { toWeekDayDateString } from '../../utils/date';
import { formatAmountToDisplay } from '../../utils/money';
import Screen from '../screen';
import PlaidTransactionsCarousel from './plaidTransactionsCarousel';

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
      showPlaidTransactions: false,
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

  togglePlaidTransactions = () => {
    this.setState(function(state) {
      return { showPlaidTransactions: !state.showPlaidTransactions };
    });
    LayoutAnimation.easeInEaseOut();
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
                    {(item.memo || item.vendor).slice(0, 25)}
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
        <View
          style={{
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.29,
            shadowRadius: 4.65,
            elevation: 7,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        >
          <TouchableOpacity
            onPress={this.togglePlaidTransactions}
            style={{
              paddingVertical: 20,
              alignItems: 'center',
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: theme.colors.lighterGray,
            }}
          >
            <Icon
              name={this.state.showPlaidTransactions ? 'caretdown' : 'caretup'}
              size={16}
            />
          </TouchableOpacity>
          {this.state.showPlaidTransactions && <PlaidTransactionsCarousel />}
        </View>
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
