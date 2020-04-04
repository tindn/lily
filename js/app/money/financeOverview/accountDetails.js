import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MoneyDisplay from '../../../components/MoneyDisplay';
import Pill from '../../../components/pill';
import Screen from '../../../components/screen';
import { getAccountEntriesForAccount } from '../../../db/accountEntries';
import {
  archiveAccount,
  getAccountById,
  updateBalanceForAccount,
} from '../../../db/accounts';
import theme from '../../../theme';
import AccountEntry from './accountEntry';
import AccountEntryForm from './accountEntryForm';

export default function AccountDetails(props) {
  const [showNewEntryForm, setForm] = useState(false);
  const [entries, setEntries] = useState([]);
  var [account, setAccount] = useState({});
  var [updatingBalance, setUpdatingBalance] = useState(false);
  var updateData = useCallback(
    function() {
      var accountId = (props.route.params || {}).accountId;
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
        <View style={styles.row}>
          <Text style={{ fontSize: 17 }}>{name}</Text>
          <ActivityIndicator animating={updatingBalance} />
          <MoneyDisplay
            amount={balance}
            style={{ color: '#000', fontSize: 17 }}
          />
        </View>
        <View style={styles.row}>
          <Text style={{ fontSize: 17 }}>{category}</Text>
          <Text style={{ fontSize: 17 }}>{type}</Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 10,
          }}
        >
          <Pill
            onPress={() => {
              Alert.alert('Confirm', 'Do you want to archive the account?', [
                {
                  text: 'Cancel',
                  onPress: function() {},
                  style: 'cancel',
                },
                {
                  text: 'Yes',
                  onPress: () =>
                    archiveAccount(id).then(() => props.navigation.pop()),
                },
              ]);
            }}
            style={{
              flex: 1,
              paddingHorizontal: 7,
              justifyContent: 'center',
              marginHorizontal: 3,
            }}
            label="Archive"
          />
          <Pill
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
              flex: 1,
              paddingHorizontal: 7,
              justifyContent: 'center',
              marginHorizontal: 3,
            }}
            label="Update Balance"
          />
          <Pill
            onPress={toggleAccountEntry}
            style={{
              paddingHorizontal: 7,
              flex: 1,
              justifyContent: 'center',
              marginHorizontal: 3,
            }}
            label="Add Entry"
          />
        </View>
        {showNewEntryForm ? (
          <AccountEntryForm
            onCancel={toggleAccountEntry}
            accountBalance={balance}
            accountId={account.id}
            onEntryChange={updateData}
            autoFocus
          />
        ) : null}
        <View
          style={{
            borderTopColor: theme.colors.lighterGray,
            borderTopWidth: 1,
            marginTop: 10,
            marginBottom: 30,
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
