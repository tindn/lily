import React from 'react';
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Text
} from 'react-native';
import Screen from '../screen';
import SpendTracking from './spendTracking';
import TransactionForm from './transactionForm';
import TransactionList from './transactionList';
import { getTransactionsCollection, fetchTransactions } from '../../utils';
import theme from '../../theme';

class Expenses extends React.Component {
  static navigationOptions = {
    header: null
  };
  state = {
    refreshing: false,
    tenDaysTransactions: [],
    fetchingTenDaysTransactions: false
  };

  componentDidMount() {
    getTransactionsCollection().onSnapshot(this.getTenDaysTransactions);
    this.fetchData();
  }

  getTenDaysTransactions = () => {
    this.setState({ fetchingTenDaysTransactions: true });
    let tenDaysAgo = new Date(Date.now() - 864000000);
    tenDaysAgo = new Date(
      tenDaysAgo.getFullYear(),
      tenDaysAgo.getMonth(),
      tenDaysAgo.getDate()
    );
    return fetchTransactions([
      ['where', 'date', '>=', tenDaysAgo],
      ['orderBy', 'date', 'desc']
    ]);
  };

  fetchData = () => {
    this.setState({ refreshing: true });
    this.getTenDaysTransactions().then(transactions => {
      this.setState({
        tenDaysTransactions: transactions,
        fetchingTenDaysTransactions: false,
        refreshing: false
      });
    });
  };

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
          <SpendTracking />
          <TouchableOpacity
            onPress={() => {}}
            style={{
              padding: 7,
              backgroundColor: theme.colors.lighterGray,
              borderRadius: 5,
              width: 100,
              alignSelf: 'center',
              top: 7,
              zIndex: 1,
              marginTop: 20
            }}
          >
            <Text style={{ textAlign: 'center' }}>past 10 days</Text>
          </TouchableOpacity>
          <TransactionList
            data={this.state.tenDaysTransactions}
            refreshing={this.state.fetchingTenDaysTransactions}
          />
        </ScrollView>
      </Screen>
    );
  }
}

export default Expenses;
