import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { watchData } from '../../firebaseHelper';
import theme from '../theme';
import MoneyDisplay from '../components/moneyDisplay';
import Pill from '../components/pill';
import Screen from '../components/screen';
import AccountEntry from './accountEntry';
import AccountEntryForm from './accountEntryForm';
import { by } from '../../utils/sort';

function AccountDetails(props) {
  const [showNewEntryForm, setForm] = useState(false);
  const [entries, setEntries] = useState();

  useEffect(() => {
    const unsubscribe = watchData(
      'accountEntries',
      [['where', 'accountId', '==', props.accountId]],
      entries => setEntries(Object.values(entries).sort(by('date', 'desc')))
    );
    return function cleanup() {
      unsubscribe();
    };
  });

  const toggleAccountEntry = () => {
    setForm(!showNewEntryForm);
  };

  if (!props.account) {
    return null;
  }
  const { name, balance, type, category, plaidAccessToken } = props.account;
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
          {showNewEntryForm ? (
            <AccountEntryForm
              onCancel={toggleAccountEntry}
              accountId={props.accountId}
              accountBalance={balance}
              account={props.account}
            />
          ) : (
            <Pill
              backgroundColor={theme.colors.primary}
              color={theme.colors.secondary}
              onPress={toggleAccountEntry}
              style={{ padding: 12, marginLeft: 50, marginRight: 50 }}
              label="Add Entry"
              textStyle={{ textAlign: 'center' }}
            />
          )}
        </View>
        <FlatList
          data={entries}
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

AccountDetails.navigationOptions = ({ navigation }) => {
  const account = navigation.getParam('accountName', undefined);
  return { title: account.name || 'Account Details' };
};

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
