import React from 'react';
import { Text, ScrollView, StyleSheet, View, FlatList } from 'react-native';
import Screen from '../screen';
import theme from '../../theme';
import MoneyDisplay from '../moneyDisplay';
import firebase from 'firebase';
import LineItem from './lineItem';
import AccountEntry from './accountEntry';

class AccountDetails extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const account = navigation.getParam('account', {});
    return { title: account.name || 'Account Details' };
  };

  static getDerivedStateFromProps(props, state) {
    if (!state.account.id) {
      const account = props.navigation.getParam('account', {});
      return {
        account,
      };
    }
    return null;
  }

  state = {
    account: {},
  };

  componentDidMount() {
    firebase
      .firestore()
      .collection('accountEntries')
      .where('accountId', '==', this.state.account.id)
      .orderBy('date', 'desc')
      .onSnapshot(
        function(snapshot) {
          let entries = {};
          snapshot.forEach(function(doc) {
            let entry = doc.data();
            entry.id = doc.id;
            entry.date = entry.date.toDate();
            entries[doc.id] = entry;
          });
          this.setState({ entries: Object.values(entries) });
        }.bind(this)
      );
  }

  render() {
    const { name, balance, type, category } = this.state.account;
    return (
      <Screen>
        <ScrollView>
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
          <FlatList
            data={this.state.entries}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <AccountEntry entry={item} />}
            style={{
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
    padding: 12,
    backgroundColor: '#fff',
    borderBottomColor: theme.colors.lighterGray,
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});

export default AccountDetails;
