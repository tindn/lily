import React, { useEffect, useState, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import MoneyDisplay from '../../../components/moneyDisplay';
import Pill from '../../../components/pill';
import Screen from '../../../components/screen';
import theme from '../../../theme';
import AccountEntry from './accountEntry';
import AccountEntryForm from './accountEntryForm';
import { getAccountById, updateBalanceForAccount } from '../../../db/accounts';
import { getAccountEntriesForAccount } from '../../../db/accountEntries';

function AccountDetails(props) {
  const [showNewEntryForm, setForm] = useState(false);
  const [entries, setEntries] = useState([]);
  var [account, setAccount] = useState({});
  var [updatingBalance, setUpdatingBalance] = useState(false);
  var updateData = useCallback(
    function() {
      var accountId = props.navigation.getParam('accountId', undefined);
      if (accountId) {
        getAccountById(accountId).then(function(data) {
          setAccount(data);
        });
        getAccountEntriesForAccount(accountId).then(setEntries);
      }
    },
    [props]
  );

  useEffect(() => {
    updateData();
  }, []);

  const toggleAccountEntry = () => {
    setForm(!showNewEntryForm);
  };

  const { name, balance, type, category, id } = account;
  return (
    <Screen>
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={[styles.row]}>
          <Text style={{ fontSize: 17 }}>{name}</Text>
          <ActivityIndicator animating={updatingBalance} />
          <MoneyDisplay
            amount={balance}
            style={{ color: '#000', fontSize: 17 }}
          />
        </View>
        <View style={[styles.row]}>
          <Text style={{ fontSize: 17 }}>{category}</Text>
          <Text style={{ fontSize: 17 }}>{type}</Text>
        </View>

        <View
          style={{
            marginTop: 20,
          }}
        >
          <Pill
            backgroundColor={theme.colors.primary}
            color={theme.colors.secondary}
            onPress={() => {
              setUpdatingBalance(true);
              updateBalanceForAccount(id)
                .then(function() {
                  updateData();
                })
                .finally(function() {
                  // eslint-disable-next-line no-undef
                  setTimeout(function() {
                    setUpdatingBalance(false);
                  }, 100);
                });
            }}
            style={{
              padding: 12,
              marginLeft: 50,
              marginRight: 50,
              marginBottom: 20,
            }}
            label="Update Balance"
            textStyle={{ textAlign: 'center' }}
          />
          {showNewEntryForm ? (
            <AccountEntryForm
              onCancel={toggleAccountEntry}
              accountBalance={balance}
              accountId={account.id}
              onEntryChange={updateData}
              autoFocus
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
        <View
          style={{
            borderTopColor: theme.colors.lighterGray,
            borderTopWidth: 1,
            marginVertical: 15,
          }}
        >
          {entries.map(function(item, index) {
            return (
              <AccountEntry
                key={index.toString()}
                entry={item}
                onEntryChange={updateData}
                accountId={account.id}
              />
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}

AccountDetails.navigationOptions = ({ navigation }) => {
  return { title: navigation.getParam('accountName', 'Account Details') };
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

export default AccountDetails;
