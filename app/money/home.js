import React from 'react';
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import theme from '../../theme';
import { getMonthlyAnalyticsCollection } from '../../utils';
import Pill from '../pill';
import Screen from '../screen';
import FinanceOverview from './financeOverview';
import SpendTracking from './spendTracking';
import TransactionForm from './transactionForm';

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
    getMonthlyAnalyticsCollection()
      .doc(this.currentMonthAnalyticsId)
      .get()
      .then(doc => {
        if (doc.exists) {
          const analytics = doc.data();
          analytics.id = doc.id;
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
    getMonthlyAnalyticsCollection()
      .doc(this.currentMonthAnalyticsId)
      .onSnapshot(doc => {
        if (doc.exists) {
          const analytics = doc.data();
          analytics.id = doc.id;
          this.props.updateMonthlyAnalytics(analytics);
        }
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
          <View
            style={{
              marginTop: 20,
              paddingHorizontal: 50,
            }}
          >
            <Pill
              onPress={() => {
                this.props.navigation.navigate('MonthTransactions');
              }}
              label="Transactions This Month"
              style={{ padding: 12, marginBottom: 20 }}
              color={theme.colors.secondary}
              backgroundColor={theme.colors.primary}
              textStyle={{ textAlign: 'center' }}
            />
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
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Accounts')}
          >
            <FinanceOverview />
          </TouchableOpacity>
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
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
