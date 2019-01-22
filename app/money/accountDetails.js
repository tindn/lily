import firebase from 'firebase';
import React from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import theme from '../../theme';
import MoneyDisplay from '../moneyDisplay';
import Pill from '../pill';
import Screen from '../screen';
import AccountEntry from './accountEntry';
import AccountEntryForm from './accountEntryForm';

class AccountDetails extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const account = navigation.getParam('accountName', undefined);
    return { title: account.name || 'Account Details' };
  };

  state = {
    showNewEntryForm: false,
  };

  componentDidMount() {
    firebase
      .firestore()
      .collection('accountEntries')
      .where('accountId', '==', this.props.accountId)
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
    if (!this.props.account) {
      return null;
    }
    const { name, balance, type, category } = this.props.account;
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

          <View
            style={{
              marginTop: 20,
            }}
          >
            {this.state.showNewEntryForm ? (
              <AccountEntryForm
                onCancel={() => this.setState({ showNewEntryForm: false })}
                accountId={this.props.accountId}
              />
            ) : (
              <Pill
                backgroundColor={theme.colors.primary}
                color={theme.colors.secondary}
                onPress={() => this.setState({ showNewEntryForm: true })}
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
