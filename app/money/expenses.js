import React from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import Screen from '../screen';
import SpendTracking from './spendTracking';
import TransactionForm from './transactionForm';
import TransactionList from './transactionList';

class Expenses extends React.Component {
  static navigationOptions = {
    header: null
  };
  state = {
    refreshing: false
  };

  onRefresh = () => {
    this.setState(
      () => ({ refreshing: true }),
      () => {
        console.log('refreshing');
        setTimeout(() => this.setState({ refreshing: false }), 2000);
      }
    );
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
              onRefresh={this.onRefresh}
            />
          }
        >
          <TransactionForm />
          <SpendTracking />
          <TransactionList />
        </ScrollView>
      </Screen>
    );
  }
}

export default Expenses;
