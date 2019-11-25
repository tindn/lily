import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Card from '../../../components/card';
import Screen from '../../../components/screen';
import theme from '../../../theme';
import MonthlyAnalyticsOverview from './monthlyAnalyticsOverview';
import SpendTracking from './spendTracking';
import TransactionAdd from './transactionAdd';
import TransactionForm from './transactionForm';
import { getAllFromTable } from '../../../db/shared';

class Home extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      spendingThisMonth: 0,
      earningThisMonth: 0,
      variableSpendingThisMonth: 0,
      showTransactionForm: false,
      lastThreeMonths: [],
    };
  }

  componentDidMount() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    var fourthMonthsAgo = new Date(Date.now() - 3600000 * 24 * 120).getTime();

    getAllFromTable(
      'transactions',
      ` WHERE date_time > ${startOfMonth.getTime()} ORDER BY date_time DESC `
    ).then(data => {
      var summary = data.reduce(
        function(acc, t) {
          if (t.entry_type == 'debit') {
            acc.spent = acc.spent + t.amount;
            if (t.is_discretionary) {
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
        { spent: 0, earned: 0, variableSpent: 0 }
      );
      this.setState({
        spendingThisMonth: summary.spent,
        earningThisMonth: summary.earned,
        variableSpendingThisMonth: summary.variableSpent,
      });
    });
    getAllFromTable(
      'monthly_analytics',
      ` WHERE start_date > ${fourthMonthsAgo} AND end_date < ${today.getTime()} ORDER BY start_date DESC `
    ).then(data => {
      this.setState({ lastThreeMonths: data });
    });
  }

  render() {
    return (
      <Screen>
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShuldPersistTaps="always"
          ref={ref => (this.scrollviewRef = ref)}
        >
          <Card
            onPress={() => {
              this.props.navigation.navigate('MonthTransactions');
            }}
            style={{ marginTop: 10, padding: 15 }}
          >
            <SpendTracking
              earningThisMonth={this.state.earningThisMonth}
              spendingThisMonth={this.state.spendingThisMonth}
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
            {this.state.lastThreeMonths.length
              ? this.state.lastThreeMonths.map(month => (
                  <Card
                    key={month.id}
                    onPress={() => {
                      this.props.navigation.navigate('MonthlyAnalytics');
                    }}
                    style={{ paddingHorizontal: 15 }}
                  >
                    <MonthlyAnalyticsOverview month={month} />
                  </Card>
                ))
              : null}
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

          {this.state.showTransactionForm ? (
            <TransactionForm
              collapse={() => {
                this.setState({ showTransactionForm: false });
              }}
              style={{ marginBottom: 30, marginTop: 20 }}
            />
          ) : null}
        </ScrollView>
        {!this.state.showTransactionForm ? (
          <TransactionAdd
            onPress={() => {
              this.setState({ showTransactionForm: true });
              // eslint-disable-next-line no-undef
              setTimeout(() => {
                this.scrollviewRef.scrollToEnd({ animated: true });
              }, 100);
            }}
          />
        ) : null}
      </Screen>
    );
  }
}

export default Home;
