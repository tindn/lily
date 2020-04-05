import { Button, Text } from '@ui-kitten/components';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import MoneyDisplay from '../../../components/MoneyDisplay';
import Screen from '../../../components/screen';
import { getAccountEntriesForAccount } from '../../../db/accountEntries';
import {
  archiveAccount,
  getAccountById,
  updateBalanceForAccount,
} from '../../../db/accounts';
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
          <MoneyDisplay amount={balance} style={{ fontSize: 17 }} />
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
          <Button
            size="small"
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
              marginHorizontal: 3,
            }}
          >
            Archive
          </Button>
          <Button
            size="small"
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
              marginHorizontal: 3,
            }}
          >
            Update Balance
          </Button>
          <Button
            size="small"
            onPress={toggleAccountEntry}
            style={{
              flex: 1,
              marginHorizontal: 3,
            }}
          >
            Add Entry
          </Button>
        </View>
        {showNewEntryForm ? (
          <AccountEntryForm
            style={{ marginTop: 10, marginHorizontal: 5 }}
            onCancel={toggleAccountEntry}
            accountBalance={balance}
            accountId={account.id}
            onEntryChange={updateData}
            autoFocus
          />
        ) : null}
        <View
          style={{
            marginTop: 20,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
});
