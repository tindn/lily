import React from 'react';
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Text
} from 'react-native';
import Screen from '../screen';
import SpendTracking from './spendTracking';
import TransactionForm from './transactionForm';
import TransactionList from './transactionList';
import {
  getTransactionsCollection,
  fetchTransactions,
  getTotalAmount
} from '../../utils';
import theme from '../../theme';

class Expenses extends React.Component {
  static navigationOptions = {
    header: null
  };
  state = {
    refreshing: false,
    tenDaysTransactions: [],
    fetchingTenDaysTransactions: false,
    spendingThisWeek: null,
    spendingThisMonth: null
  };

  componentDidMount() {
    getTransactionsCollection().onSnapshot(this.fetchData);
    this.fetchData();
  }

  fetchData = () => {
    this.setState({ refreshing: true });
    Promise.all([this.getTenDaysTransactions(), this.getSpendings()])
      .then(([transactions, [thisWeek, thisMonth]]) => {
        this.setState({
          tenDaysTransactions: transactions,
          spendingThisWeek: thisWeek.toFixed(2),
          spendingThisMonth: thisMonth.toFixed(2),
          fetchingTenDaysTransactions: false,
          refreshing: false
        });
      })
      .catch(() => ({
        fetchingTenDaysTransactions: false,
        refreshing: false
      }));
  };

  getTenDaysTransactions = () => {
    this.setState({ fetchingTenDaysTransactions: true });
    let tenDaysAgo = new Date(Date.now() - 864000000);
    tenDaysAgo = new Date(
      tenDaysAgo.getFullYear(),
      tenDaysAgo.getMonth(),
      tenDaysAgo.getDate()
    );
    return fetchTransactions([
      ['where', 'date', '>=', tenDaysAgo],
      ['orderBy', 'date', 'desc']
    ]);
  };

  getSpendings = () => {
    const today = new Date();
    const weekStartOffset = (today.getDay() - 1) * 86400000;
    const startOfWeek = new Date(Date.now() - weekStartOffset);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return Promise.all([
      fetchTransactions([
        ['where', 'date', '>=', startOfWeek],
        ['where', 'entryType', '==', 'debit']
      ]).then(getTotalAmount),
      fetchTransactions([
        ['where', 'date', '>=', startOfMonth],
        ['where', 'entryType', '==', 'debit']
      ]).then(getTotalAmount)
    ]);
  };

  render() {
    return (
      <Screen>
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.fetchData}
            />
          }
        >
          <TransactionForm />
          <SpendTracking
            spendingThisWeek={this.state.spendingThisWeek}
            spendingThisMonth={this.state.spendingThisMonth}
          />
          <TouchableOpacity
            onPress={() => {}}
            style={{
              padding: 7,
              backgroundColor: theme.colors.lighterGray,
              borderRadius: 5,
              width: 100,
              alignSelf: 'center',
              top: 7,
              zIndex: 1,
              marginTop: 20
            }}
          >
            <Text style={{ textAlign: 'center' }}>past 10 days</Text>
          </TouchableOpacity>
          <TransactionList
            data={this.state.tenDaysTransactions}
            refreshing={this.state.fetchingTenDaysTransactions}
          />
        </ScrollView>
      </Screen>
    );
  }
}

export default Expenses;
