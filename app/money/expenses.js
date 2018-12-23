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
  formatAmountToDisplay,
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
    weekTransactions: [],
    spendingThisMonth: undefined,
    spendingThisWeek: undefined,
    earningThisMonth: undefined,
    transactionListExpanded: false,
  };

  componentDidMount() {
    getTransactionsCollection().onSnapshot(this.fetchData);
    this.fetchData();
  }

  fetchData = () => {
    this.setState({ refreshing: true });
    this.getMonthTransactions().then(transactions => {
      const weekStartOffset = (new Date().getDay() - 1) * 86400000;
      const startOfWeek = new Date(Date.now() - weekStartOffset);
      const weekTransactions = transactions
        .filter(t => t.date >= startOfWeek)
        .sort((a, b) => b.date - a.date);
      const spendings = transactions.filter(t => t.entryType === 'debit');
      const earnings = transactions.filter(t => t.entryType === 'credit');
      this.setState({
        weekTransactions: weekTransactions,
        spendingThisMonth: getTotalAmount(spendings),
        earningThisMonth: getTotalAmount(earnings),
        spendingThisWeek: getTotalAmount(
          weekTransactions.filter(t => t.entryType === 'debit')
        ),
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
            <Text style={{ textAlign: 'center' }}>past week</Text>
          </TouchableOpacity>
          <TransactionList
            data={
              this.state.transactionListExpanded
                ? this.state.weekTransactions
                : []
            }
            refreshing={this.state.refreshing}
            emptyText={formatAmountToDisplay(this.state.spendingThisWeek)}
            navigation={this.props.navigation}
          />
        </ScrollView>
      </Screen>
    );
  }
}

export default Expenses;
