import React from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import theme from '../../theme';
import {
  getTotalAmount,
  getTransactionsFromSnapshot,
  getTransactionsQuery,
} from '../../utils';
import Button from '../button';
import Screen from '../screen';
import SpendTracking from './spendTracking';
import TransactionForm from './transactionForm';

class Home extends React.PureComponent {
  static navigationOptions = {
    header: null,
  };

  static getDerivedStateFromProps(props) {
    if (!props.monthTransactions || !props.monthTransactions.length) {
      return null;
    }
    const spendings = props.monthTransactions.filter(
      t => t.entryType === 'debit'
    );
    const earnings = props.monthTransactions.filter(
      t => t.entryType === 'credit'
    );
    props.monthTransactions.sort((a, b) => b.date - a.date);
    return {
      spendingThisMonth: getTotalAmount(spendings),
      earningThisMonth: getTotalAmount(earnings),
      monthTransactions: props.monthTransactions,
    };
  }

  constructor(props) {
    super(props);
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.monthTransactionsQuery = getTransactionsQuery([
      ['where', 'date', '>=', startOfMonth],
    ]);
    this.state = {
      refreshing: false,
      spendingThisMonth: undefined,
      earningThisMonth: undefined,
      transactionListExpanded: false,
      transactionFormExpanded: false,
    };
  }

  fetchData = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
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

  componentDidMount() {
    this.monthTransactionsQuery.onSnapshot(snapshot => {
      const transactions = getTransactionsFromSnapshot(snapshot);
      this.props.updateMonthTransactions(transactions);
    });
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
          <Button
            onPress={() => {
              this.props.navigation.navigate('MonthTransactions');
            }}
            label="Transactions This Month"
            style={sharedStyles.mainButton}
            color={theme.colors.primary}
            textStyle={{ textAlign: 'center' }}
          />
          <Button
            onPress={() => {
              this.props.navigation.navigate('MonthlyAnalytics');
            }}
            label="Monthly Analytics"
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

function mapStateToProps(state) {
  return {
    monthTransactions: state.monthTransactions,
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
)(Home);
