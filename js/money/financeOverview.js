import moment from 'moment';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { watchData } from '../../firebaseHelper';
import theme from '../theme';
import { calculateFinanceOverview } from '../../utils/money';
import MoneyDisplay from '../components/moneyDisplay';
import Screen from '../components/screen';
import Card from '../components/card';
class FinanceOverview extends React.PureComponent {
  static getDerivedStateFromProps(props) {
    if (props.accounts) {
      return calculateFinanceOverview(Object.values(props.accounts));
    }
    return null;
  }

  state = {};

  componentDidMount() {
    this.unsubscribe = watchData('accounts', [], this.props.updateAccounts);
    this.unsubscribe = watchData(
      'accountsSnapshots',
      [['orderBy', '_updatedOn', 'desc']],
      this.props.updateAccountsSnapshots
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    let liquidityRate,
      networthRate = 0;
    if (
      this.props.financeSnapshots &&
      this.props.financeSnapshots.length &&
      this.state.liquidity
    ) {
      const firstSnapshot = this.props.financeSnapshots[
        this.props.financeSnapshots.length - 1
      ];
      firstSnapshot._updatedOn = moment(firstSnapshot._updatedOn);
      const today = moment();
      const days = today.diff(firstSnapshot._updatedOn, 'days');
      const changeInLiquidity = this.state.liquidity - firstSnapshot.liquidity;
      const changeInNetworth = this.state.networth - firstSnapshot.networth;
      liquidityRate = ((changeInLiquidity / days) * 30).toFixed(2);
      networthRate = ((changeInNetworth / days) * 30).toFixed(2);
    }
    return (
      <Screen>
        <ScrollView>
          <Card
            style={{
              marginTop: 20,
            }}
            onPress={() => this.props.navigation.navigate('Accounts')}
          >
            <View
              key="first"
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}
            >
              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    marginBottom: 10,
                    color: theme.colors.darkGray,
                  }}
                >
                  Current
                </Text>
                <MoneyDisplay
                  amount={this.state.liquidity}
                  style={{
                    fontSize: 15,
                    fontWeight: '500',
                    paddingBottom: 5,
                  }}
                />
                <MoneyDisplay
                  amount={this.state.networth}
                  style={{
                    fontSize: 15,
                    fontWeight: '500',
                    paddingBottom: 5,
                  }}
                />
              </View>
              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    marginBottom: 10,
                    color: theme.colors.darkGray,
                  }}
                >
                  Last
                </Text>
                <MoneyDisplay
                  amount={
                    this.props.financeSnapshots[1]
                      ? this.props.financeSnapshots[1].liquidity
                      : 0
                  }
                  style={{
                    fontSize: 15,
                    fontWeight: '500',
                    paddingBottom: 5,
                  }}
                />
                <MoneyDisplay
                  amount={
                    this.props.financeSnapshots[1]
                      ? this.props.financeSnapshots[1].networth
                      : 0
                  }
                  style={{
                    fontSize: 15,
                    fontWeight: '500',
                    paddingBottom: 5,
                  }}
                />
              </View>
              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    marginBottom: 10,
                    color: theme.colors.darkGray,
                  }}
                >
                  Avg. monthly
                </Text>
                <MoneyDisplay
                  amount={liquidityRate}
                  style={{
                    fontSize: 15,
                    fontWeight: '500',
                    paddingBottom: 5,
                  }}
                />
                <MoneyDisplay
                  amount={networthRate}
                  style={{
                    fontSize: 15,
                    fontWeight: '500',
                    paddingBottom: 5,
                  }}
                />
              </View>
            </View>
            <View
              key="second"
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 20,
              }}
            >
              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    marginBottom: 10,
                    color: theme.colors.darkGray,
                  }}
                >
                  1 year
                </Text>
                <MoneyDisplay
                  amount={(this.state.liquidity + liquidityRate * 12).toFixed(
                    2
                  )}
                  style={{
                    fontSize: 15,
                    fontWeight: '500',
                    paddingBottom: 5,
                  }}
                />
                <MoneyDisplay
                  amount={(this.state.networth + networthRate * 12).toFixed(2)}
                  style={{
                    fontSize: 15,
                    fontWeight: '500',
                    paddingBottom: 5,
                  }}
                />
              </View>
              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    marginBottom: 10,
                    color: theme.colors.darkGray,
                  }}
                >
                  3 years
                </Text>
                <MoneyDisplay
                  amount={(this.state.liquidity + liquidityRate * 36).toFixed(
                    2
                  )}
                  style={{
                    fontSize: 15,
                    fontWeight: '500',
                    paddingBottom: 5,
                  }}
                />
                <MoneyDisplay
                  amount={(this.state.networth + networthRate * 36).toFixed(2)}
                  style={{
                    fontSize: 15,
                    fontWeight: '500',
                    paddingBottom: 5,
                  }}
                />
              </View>
              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    marginBottom: 10,
                    color: theme.colors.darkGray,
                  }}
                >
                  5 years
                </Text>
                <MoneyDisplay
                  amount={(this.state.liquidity + liquidityRate * 60).toFixed(
                    2
                  )}
                  style={{
                    fontSize: 15,
                    fontWeight: '500',
                    paddingBottom: 5,
                  }}
                />
                <MoneyDisplay
                  amount={(this.state.networth + networthRate * 60).toFixed(2)}
                  style={{
                    fontSize: 15,
                    fontWeight: '500',
                    paddingBottom: 5,
                  }}
                />
              </View>
            </View>
          </Card>
        </ScrollView>
      </Screen>
    );
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.accounts,
    financeSnapshots: state.financeSnapshots,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateAccounts(accounts) {
      dispatch({ type: 'UPDATE_ACCOUNTS', payload: accounts });
    },
    updateAccountsSnapshots(snapshots) {
      const overviews = snapshots.map(function(snapshot) {
        let overview = calculateFinanceOverview(Object.values(snapshot));
        overview._updatedOn = snapshot._updatedOn;
        return overview;
      });
      dispatch({
        type: 'UPDATE_FINANCE_SNAPSHOTS',
        payload: overviews,
      });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FinanceOverview);
