import React from 'react';
import {
  LayoutAnimation,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import theme from '../../theme';
import {
  fetchTransactions,
  getTotalAmount,
  getTransactionsCollection,
} from '../../utils';
import Screen from '../screen';
import SpendTracking from './spendTracking';
import TransactionForm from './transactionForm';
import TransactionList from './transactionList';

class Expenses extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    refreshing: false,
    fetchingTenDaysTransactions: false,
    tenDaysTransactions: [],
    spendingThisMonth: undefined,
    transactionListExpanded: false,
    earningThisMonth: undefined,
  };

  componentDidMount() {
    getTransactionsCollection().onSnapshot(this.fetchData);
    this.fetchData();
  }

  fetchData = () => {
    this.setState({ refreshing: true, fetchingTenDaysTransactions: true });
    this.getMonthTransactions().then(transactions => {
      let tenDaysAgo = new Date(Date.now() - 864000000);
      const tenDaysTransactions = transactions
        .filter(t => t.date >= tenDaysAgo)
        .sort((a, b) => b.date - a.date);
      const spendings = transactions.filter(t => t.entryType === 'debit');
      const earnings = transactions.filter(t => t.entryType === 'credit');
      this.setState({
        tenDaysTransactions: tenDaysTransactions,
        spendingThisMonth: getTotalAmount(spendings),
        earningThisMonth: getTotalAmount(earnings),
        fetchingTenDaysTransactions: false,
        refreshing: false,
      });
    });
  };

  getMonthTransactions() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return fetchTransactions([['where', 'date', '>=', startOfMonth]]);
  }

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
            spendingThisMonth={this.state.spendingThisMonth}
            earningThisMonth={this.state.earningThisMonth}
          />
          <TouchableOpacity
            onPress={() => {
              LayoutAnimation.easeInEaseOut();
              this.setState({
                transactionListExpanded: !this.state.transactionListExpanded,
              });
            }}
            style={{
              padding: 7,
              backgroundColor: theme.colors.lighterGray,
              borderRadius: 5,
              width: 100,
              alignSelf: 'center',
              top: 7,
              zIndex: 1,
              marginTop: 20,
            }}
          >
            <Text style={{ textAlign: 'center' }}>past 10 days</Text>
          </TouchableOpacity>
          <TransactionList
            data={
              this.state.transactionListExpanded
                ? this.state.tenDaysTransactions
                : []
            }
            refreshing={this.state.fetchingTenDaysTransactions}
            emptyText="Press above to expand."
            navigation={this.props.navigation}
          />
        </ScrollView>
      </Screen>
    );
  }
}

export default Expenses;
