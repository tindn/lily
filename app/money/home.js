import React from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import { getDocument, watchData, watchDocument } from '../../firebaseHelper';
import theme from '../../theme';
import Card from '../card';
import Pill from '../pill';
import Screen from '../screen';
import FinanceOverview from './financeOverview';
import SpendTracking from './spendTracking';
import TransactionAdd from './transactionAdd';

class Home extends React.PureComponent {
  static navigationOptions = {
    header: null,
  };

  static getDerivedStateFromProps(props) {
    if (props.monthlyAnalytics) {
      const currentMonthAnalyticsId = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
      });

      const currentMonthAnalytics =
        props.monthlyAnalytics[currentMonthAnalyticsId];
      if (currentMonthAnalytics) {
        return {
          spendingThisMonth: currentMonthAnalytics.spent,
          earningThisMonth: currentMonthAnalytics.earned,
        };
      }
    }
    return null;
  }
  state = {
    refreshing: false,
    spendingThisMonth: undefined,
    earningThisMonth: undefined,
    transactionListExpanded: false,
    transactionFormExpanded: false,
  };

  currentMonthAnalyticsId = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
  });

  fetchData = () => {
    this.setState({ refreshing: true });
    getDocument('monthlyAnalytics', this.currentMonthAnalyticsId)
      .then(analytics => {
        if (analytics) {
          this.props.updateMonthlyAnalytics(analytics);
        }
      })
      .finally(() => {
        this.setState({
          refreshing: false,
        });
      });
  };

  componentDidMount() {
    watchDocument(
      'monthlyAnalytics',
      this.currentMonthAnalyticsId,
      this.props.updateMonthlyAnalytics
    );
    watchData('vendors', [], this.props.updateVendors);
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
              paddingTop: 25,
              paddingBottom: 25,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
            onPress={() => this.props.navigation.navigate('Accounts')}
          >
            <FinanceOverview />
          </Card>
          <View
            style={{
              marginTop: 25,
              paddingHorizontal: 50,
            }}
          >
            <Pill
              onPress={() => {
                this.props.navigation.navigate('MonthlyAnalytics');
              }}
              label="Monthly Analytics"
              style={{ padding: 12 }}
              color={theme.colors.secondary}
              backgroundColor={theme.colors.primary}
              textStyle={{ textAlign: 'center' }}
            />
          </View>
          <View
            style={{
              marginTop: 25,
              paddingHorizontal: 50,
            }}
          >
            <Pill
              onPress={() => {
                this.props.navigation.navigate('Vendors');
              }}
              label="Vendors"
              style={{ padding: 12 }}
              color={theme.colors.secondary}
              backgroundColor={theme.colors.primary}
              textStyle={{ textAlign: 'center' }}
            />
          </View>
        </ScrollView>
        <TransactionAdd />
      </Screen>
    );
  }
}

function mapStateToProps(state) {
  return {
    monthlyAnalytics: state.monthlyAnalytics,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateMonthlyAnalytics(analytics) {
      dispatch({
        type: 'UPDATE_MONTHLY_ANALYTICS',
        payload: {
          [analytics.id]: analytics,
        },
      });
    },
    updateVendors(vendors) {
      dispatch({
        type: 'UPDATE_VENDORS',
        payload: vendors,
      });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
