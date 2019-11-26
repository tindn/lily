import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import MoneyDisplay from '../../components/moneyDisplay';
import Pill from '../../components/pill';
import Screen from '../../components/screen';
import theme from '../../theme';
import AccountEntry from './accountEntry';
import AccountEntryForm from './accountEntryForm';
import { getById, getAllFromTable } from '../../db/shared';

function AccountDetails(props) {
  const [showNewEntryForm, setForm] = useState(false);
  const [entries, setEntries] = useState([]);
  var [account, setAccount] = useState({});
  var updateData = useCallback(
    function() {
      var accountId = props.navigation.getParam('accountId', undefined);
      if (accountId) {
        getById('accounts', accountId).then(function(data) {
          setAccount(data[0]);
        });
        getAllFromTable(
          'account_entries',
          `WHERE account_id = '${accountId}' ORDER BY date_time DESC`
        ).then(setEntries);
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

  const { name, balance, type, category } = account;
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

        <View
          style={{
            marginTop: 20,
          }}
        >
          {showNewEntryForm ? (
            <AccountEntryForm
              onCancel={toggleAccountEntry}
              accountBalance={balance}
              accountId={account.id}
              onEntryChange={updateData}
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
            marginTop: 30,
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
