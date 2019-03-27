import React from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { watchData } from '../../firebaseHelper';
import theme from '../../theme';
import { by } from '../../utils/sort';
import Card from '../card';
import Pill from '../pill';
import Screen from '../screen';
import FinanceOverview from './financeOverview';
import MonthlyAnalyticsOverview from './monthlyAnalyticsOverview';
import SpendTracking from './spendTracking';
import TransactionAdd from './transactionAdd';

class Home extends React.PureComponent {
  static navigationOptions = {
    header: null,
  };

  static getDerivedStateFromProps(props) {
    if (props.monthTransactions) {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const summary = props.monthTransactions.reduce(
        function(acc, t) {
          if (t.date < startOfMonth) {
            return acc;
          }
          if (t.entryType == 'debit') {
            acc.spent = acc.spent + t.amount;
            return acc;
          }

          if (t.entryType == 'credit') {
            acc.earned = acc.earned + t.amount;
            return acc;
          }
          return acc;
        },
        { spent: 0, earned: 0 }
      );

      return {
        spendingThisMonth: summary.spent.toFixed(2),
        earningThisMonth: summary.earned.toFixed(2),
      };
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      spendingThisMonth: undefined,
      earningThisMonth: undefined,
      transactionListExpanded: false,
      transactionFormExpanded: false,
    };
  }

  currentMonthAnalyticsId = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
  });

  componentDidMount() {
    const transactionsStartDate = new Date(Date.now() - 3600000 * 24 * 35);
    this.unsubscribe = watchData(
      'transactions',
      [
        ['where', 'date', '>=', transactionsStartDate],
        ['orderBy', 'date', 'desc'],
      ],
      this.props.updateMonthTransactions
    );

    this.unsubscribe2 = watchData('vendors', [], this.props.updateVendors);
    this.unsubscribe3 = watchData(
      'monthlyAnalytics',
      [],
      this.props.updateMonthlyAnalytics
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.unsubscribe2();
    this.unsubscribe3();
  }

  render() {
    const lastThreeMonths = Object.values(this.props.monthlyAnalytics)
      .sort(by('startDate', 'desc'))
      .slice(0, 3);
    return (
      <Screen>
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
        >
          <Card
            onPress={() => {
              this.props.navigation.navigate('MonthTransactions');
            }}
          >
            <SpendTracking
              spendingThisMonth={this.state.spendingThisMonth}
              earningThisMonth={this.state.earningThisMonth}
              navigation={this.props.navigation}
            />
          </Card>
          <Card
            style={{
              marginTop: 25,
              paddingVertical: 25,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
            onPress={() => this.props.navigation.navigate('MonthlyAnalytics')}
          >
            <MonthlyAnalyticsOverview data={lastThreeMonths} />
          </Card>
          <Card
            style={{
              marginTop: 25,
              paddingVertical: 25,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
            onPress={() => this.props.navigation.navigate('Accounts')}
          >
            <FinanceOverview />
          </Card>
          <Pill
            onPress={() => {
              this.props.navigation.navigate('Vendors');
            }}
            label="Vendors"
            style={{
              padding: 12,
              marginTop: 25,
              marginHorizontal: 50,
            }}
            color={theme.colors.secondary}
            backgroundColor={theme.colors.primary}
            textStyle={{ textAlign: 'center' }}
          />
        </ScrollView>
        <TransactionAdd />
      </Screen>
    );
  }
}

function mapStateToProps(state) {
  return {
    monthTransactions: state.monthTransactions,
    monthlyAnalytics: state.monthlyAnalytics,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateVendors(vendors) {
      dispatch({
        type: 'UPDATE_VENDORS',
        payload: vendors,
      });
    },
    updateMonthTransactions(transactions) {
      dispatch({ type: 'UPDATE_MONTH_TRANSACTIONS', transactions });
    },
    updateMonthlyAnalytics(analytics) {
      dispatch({
        type: 'UPDATE_MONTHLY_ANALYTICS',
        payload: analytics,
      });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
