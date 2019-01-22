import firebase from 'firebase';
import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import theme from '../../theme';
import MoneyDisplay from '../moneyDisplay';

class FinanceOverview extends React.PureComponent {
  static getDerivedStateFromProps(props) {
    if (props.accounts) {
      const accounts = Object.values(props.accounts);
      let totalAssets = 0,
        totalLiabilities = 0,
        liquidAssets = 0,
        shortTermLiabilities = 0;
      accounts.forEach(function(account) {
        switch (account.category) {
          case 'Investments':
          case 'Fixed Assets':
            totalAssets += account.balance;
            break;
          case 'Liquid Assets':
            totalAssets += account.balance;
            liquidAssets += account.balance;
            break;
          case 'Long Term Liabilities':
            totalLiabilities += account.balance;
            break;
          case 'Short Term Liabilities':
            totalLiabilities += account.balance;
            shortTermLiabilities += account.balance;
            break;
          default:
            break;
        }
      });

      return {
        totalAssets,
        totalLiabilities,
        liquidAssets,
        shortTermLiabilities,
      };
    }
    return null;
  }

  state = {
    liquidity: undefined,
  };

  componentDidMount() {
    firebase
      .firestore()
      .collection('accounts')
      .onSnapshot(
        function(snapshot) {
          let data = {};
          snapshot.forEach(function(doc) {
            let account = doc.data();
            account.id = doc.id;
            data[doc.id] = account;
          });
          this.props.updateAccounts(data);
        }.bind(this)
      );
  }

  render() {
    return [
      <View key="liquidity" style={{ alignItems: 'center' }}>
        <MoneyDisplay
          amount={this.state.liquidAssets - this.state.shortTermLiabilities}
          style={{
            fontSize: 17,
            fontWeight: '600',
            paddingBottom: 5,
          }}
        />
        <Text
          style={{
            color: theme.colors.darkGray,
            fontSize: 12,
            fontWeight: '500',
          }}
        >
          Liquidity
        </Text>
      </View>,
      <View key="networth" style={{ alignItems: 'center' }}>
        <MoneyDisplay
          amount={this.state.totalAssets - this.state.totalLiabilities}
          style={{
            fontSize: 17,
            fontWeight: '600',
            paddingBottom: 5,
          }}
        />
        <Text
          style={{
            color: theme.colors.darkGray,
            fontSize: 12,
            fontWeight: '500',
          }}
        >
          Networth
        </Text>
      </View>,
    ];
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.accounts,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateAccounts(accounts) {
      dispatch({ type: 'UPDATE_ACCOUNTS', payload: accounts });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FinanceOverview);
