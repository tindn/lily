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
    transactionFormExpanded: false,
  };

  componentDidMount() {
    getTransactionsCollection().onSnapshot(this.fetchData);
    this.fetchData();
  }

  fetchData = () => {
    this.setState({ refreshing: true });
    this.getMonthTransactions().then(transactions => {
      const dayOfWeek = new Date().getDay();
      const weekStartOffset = (dayOfWeek ? dayOfWeek - 1 : 6) * 86400000;
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
          <SpendTracking
            spendingThisMonth={this.state.spendingThisMonth}
            earningThisMonth={this.state.earningThisMonth}
          />
          <TransactionForm
            isExpanded={this.state.transactionFormExpanded}
            collapse={() => {
              this.setState({ transactionFormExpanded: false });
            }}
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
              marginTop: 10,
            }}
          >
            <Text style={{ textAlign: 'center' }}>this week</Text>
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
        <TouchableOpacity
          onPress={() => {
            if (!this.state.transactionFormExpanded) {
              this.setState({
                transactionFormExpanded: true,
              });
            }
          }}
          style={{
            position: 'absolute',
            bottom: 10,
            alignSelf: 'center',
            backgroundColor: theme.colors.primary,
            borderRadius: 30,
            width: 60,
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,
            elevation: 4,
          }}
        >
          <Text style={{ color: theme.colors.secondary, fontSize: 16 }}>
            Add
          </Text>
        </TouchableOpacity>
      </Screen>
    );
  }
}

export default Expenses;
