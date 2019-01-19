import React from 'react';
import { Text, ScrollView, StyleSheet, View } from 'react-native';
import Screen from '../screen';
import theme from '../../theme';
import MoneyDisplay from '../moneyDisplay';

class AccountDetails extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const account = navigation.getParam('account', {});
    return { title: account.name || 'Account Details' };
  };

  static getDerivedStateFromProps(props) {
    const account = props.navigation.getParam('account', {});
    return {
      account,
    };
  }

  state = {
    account: {},
  };

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
