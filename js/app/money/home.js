import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { watchData } from '../../../firebaseHelper';
import theme from '../../theme';
import { by } from '../../../utils/sort';
import Screen from '../../components/screen';
import Card from '../../components/card';
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
            if (t.isFixed) {
              acc.fixedSpent = acc.fixedSpent + t.amount;
            } else {
              acc.variableSpent = acc.variableSpent + t.amount;
            }
            return acc;
          }

          if (t.entryType == 'credit') {
            acc.earned = acc.earned + t.amount;
            return acc;
          }
          return acc;
        },
        { spent: 0, earned: 0, fixedSpent: 0, variableSpent: 0 }
      );

      return {
        spendingThisMonth: summary.spent,
        earningThisMonth: summary.earned,
        fixedSpendingThisMonth: summary.fixedSpent,
        variableSpendingThisMonth: summary.variableSpent,
      };
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      spendingThisMonth: 0,
      earningThisMonth: 0,
      fixedSpendingThisMonth: 0,
      variableSpendingThisMonth: 0,
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
      .slice(1, 4);
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
            style={{ marginTop: 10, padding: 15 }}
          >
            <SpendTracking
              spendingThisMonth={this.state.spendingThisMonth}
              fixedSpendingThisMonth={this.state.fixedSpendingThisMonth}
              variableSpendingThisMonth={this.state.variableSpendingThisMonth}
              navigation={this.props.navigation}
            />
          </Card>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 15,
              justifyContent: 'space-around',
            }}
          >
            {lastThreeMonths &&
              lastThreeMonths.map(month => (
                <Card
                  key={month.id}
                  onPress={() => {
                    this.props.navigation.navigate('MonthlyAnalytics');
                  }}
                  style={{ paddingHorizontal: 15 }}
                >
                  <MonthlyAnalyticsOverview month={month} />
                </Card>
              ))}
          </View>
          <Card
            style={{
              paddingVertical: 15,
              marginTop: 15,
              alignItems: 'center',
            }}
            onPress={() => this.props.navigation.navigate('Vendors')}
          >
            <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>
              Vendors
            </Text>
          </Card>
          <Card
            style={{
              paddingVertical: 15,
              marginTop: 15,
              alignItems: 'center',
            }}
            onPress={() => this.props.navigation.navigate('FinanceOverview')}
          >
            <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>
              Overview
            </Text>
          </Card>
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