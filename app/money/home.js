import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { watchData } from '../../firebaseHelper';
import theme from '../../theme';
import { getTotalAmount, formatAmountToDisplay } from '../../utils/money';
import { by } from '../../utils/sort';
import Card from '../card';
import Pill from '../pill';
import Screen from '../screen';
import FinanceOverview from './financeOverview';
import SpendTracking from './spendTracking';
import TransactionAdd from './transactionAdd';
import MonthlyAnalyticsOverview from './monthlyAnalyticsOverview';

class Home extends React.PureComponent {
  static navigationOptions = {
    header: null,
  };

  static getDerivedStateFromProps(props) {
    if (props.monthTransactions) {
      const spent = getTotalAmount(
        props.monthTransactions.filter(t => t.entryType === 'debit')
      ).toFixed(2);
      const earned = getTotalAmount(
        props.monthTransactions.filter(t => t.entryType === 'credit')
      ).toFixed(2);
      return {
        spendingThisMonth: spent,
        earningThisMonth: earned,
      };
    }

    return null;
  }

  constructor(props) {
    super(props);
    const today = new Date();
    this.startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
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
    this.unsubscribe = watchData(
      'transactions',
      [['where', 'date', '>=', this.startOfMonth], ['orderBy', 'date', 'desc']],
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
      .slice(0, 3)
      .sort(by('startDate', 'asc'));
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
