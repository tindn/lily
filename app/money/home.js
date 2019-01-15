import React from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
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
import Button from '../button';

class Home extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    refreshing: false,
    spendingThisMonth: undefined,
    earningThisMonth: undefined,
    transactionListExpanded: false,
    transactionFormExpanded: false,
    monthTransactions: undefined,
  };

  componentDidMount() {
    getTransactionsCollection().onSnapshot(this.fetchData);
    this.fetchData();
  }

  fetchData = () => {
    this.setState({ refreshing: true });
    this.getMonthTransactions()
      .then(transactions => {
        const spendings = transactions.filter(t => t.entryType === 'debit');
        const earnings = transactions.filter(t => t.entryType === 'credit');
        transactions.sort((a, b) => b.date - a.date);
        this.setState({
          spendingThisMonth: getTotalAmount(spendings),
          earningThisMonth: getTotalAmount(earnings),
          refreshing: false,
          monthTransactions: transactions,
        });
      })
      .catch(() => {
        this.setState({
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
            navigation={this.props.navigation}
          />
          <TransactionForm
            isExpanded={this.state.transactionFormExpanded}
            collapse={() => {
              this.setState({ transactionFormExpanded: false });
            }}
          />
          {this.state.monthTransactions && (
            <Button
              onPress={() => {
                this.props.navigation.navigate('MonthTransactions', {
                  data: this.state.monthTransactions,
                });
              }}
              label="View Month"
              style={sharedStyles.mainButton}
              color={theme.colors.primary}
              textStyle={{ textAlign: 'center' }}
            />
          )}
          <Button
            onPress={() => {
              this.props.navigation.navigate('MonthlyAnalytics');
            }}
            label="View Analytics"
            style={sharedStyles.mainButton}
            color={theme.colors.primary}
            textStyle={{ textAlign: 'center' }}
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

const sharedStyles = StyleSheet.create({
  mainButton: {
    width: '100%',
    alignSelf: 'center',
    padding: 20,
    marginTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderRadius: 0,
  },
});

export default Home;
