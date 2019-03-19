import React from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { watchData } from '../../firebaseHelper';
import theme from '../../theme';
import MoneyDisplay from '../moneyDisplay';
import Pill from '../pill';
import Screen from '../screen';
import AccountEntry from './accountEntry';
import AccountEntryForm from './accountEntryForm';
import { by } from '../../utils/sort';

class AccountDetails extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const account = navigation.getParam('accountName', undefined);
    return { title: account.name || 'Account Details' };
  };

  state = {
    showNewEntryForm: false,
  };

  componentDidMount() {
    this.unsubscribe = watchData(
      'accountEntries',
      [['where', 'accountId', '==', this.props.accountId]],
      entries =>
        this.setState({
          entries: Object.values(entries).sort(by('date', 'desc')),
        })
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  toggleAccountEntry = () => {
    this.setState(function(state) {
      return { showNewEntryForm: !state.showNewEntryForm };
    });
  };

  render() {
    if (!this.props.account) {
      return null;
    }
    const {
      name,
      balance,
      type,
      category,
      plaidAccessToken,
    } = this.props.account;
    return (
      <Screen>
        <ScrollView keyboardShouldPersistTaps="always">
          <View style={[styles.row]}>
            <Text style={{ fontSize: 17 }}>{name}</Text>
            <MoneyDisplay
              amount={balance}
              style={{ color: '#000', fontSize: 17 }}
            />
          </View>
          <View style={[styles.row]}>
            <Text style={{ fontSize: 17 }}>{category}</Text>
            <Text style={{ fontSize: 17 }}>{type}</Text>
          </View>
          {plaidAccessToken && (
            <View style={styles.row}>
              <View />
              <Text>Has Plaid</Text>
            </View>
          )}

          <View
            style={{
              marginTop: 20,
            }}
          >
            {this.state.showNewEntryForm ? (
              <AccountEntryForm
                onCancel={this.toggleAccountEntry}
                accountId={this.props.accountId}
                accountBalance={balance}
                account={this.props.account}
              />
            ) : (
              <Pill
                backgroundColor={theme.colors.primary}
                color={theme.colors.secondary}
                onPress={this.toggleAccountEntry}
                style={{ padding: 12, marginLeft: 50, marginRight: 50 }}
                label="Add Entry"
                textStyle={{ textAlign: 'center' }}
              />
            )}
          </View>
          <FlatList
            data={this.state.entries}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <AccountEntry entry={item} />}
            style={{
              borderTopColor: theme.colors.lighterGray,
              borderTopWidth: 1,
              marginTop: 30,
            }}
          />
        </ScrollView>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: '#fff',
    borderBottomColor: theme.colors.lighterGray,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
});

function mapStateToProps(state, ownProps) {
  const accountId = ownProps.navigation.getParam('accountId', '');
  return {
    account: state.accounts[accountId],
    accountId,
  };
}

export default connect(mapStateToProps)(AccountDetails);
