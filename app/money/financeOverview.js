import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { watchData } from '../../firebaseHelper';
import theme from '../../theme';
import MoneyDisplay from '../moneyDisplay';
import { calculateFinanceOverview } from '../../utils/money';

class FinanceOverview extends React.PureComponent {
  static getDerivedStateFromProps(props) {
    if (props.accounts) {
      return calculateFinanceOverview(Object.values(props.accounts));
    }
    return null;
  }

  state = {
    liquidity: undefined,
  };

  componentDidMount() {
    this.unsubscribe = watchData('accounts', [], this.props.updateAccounts);
  }

  componentWillUnmount() {
    this.unsubscribe();
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
