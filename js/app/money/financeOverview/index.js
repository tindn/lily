import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Card from '../../../components/card';
import MoneyDisplay from '../../../components/moneyDisplay';
import Pill from '../../../components/pill';
import Screen from '../../../components/screen';
import {
  buildAccountSnapshot,
  getEarliestSnapshot,
  getLatestSnapshot,
} from '../../../db/accountSnapshots';
import { getAllFromTable } from '../../../db/shared';
import { useToggle } from '../../../hooks';
import theme from '../../../theme';
import { calculateFinanceOverview } from '../../../utils/money';
import Category from './category';
import LineItem from './lineItem';

function FinanceOverview(props) {
  var [overview, setOverview] = useState({});
  var [earliestSnapshot, setEarliestSnapshot] = useState({});
  var [latestSnapshot, setLatestSnapshot] = useState({});
  var [liquidityRate, setLiquidityRate] = useState(0);
  var [networthRate, setNetworthRate] = useState(0);
  var [showAssets, toggleShowAssets] = useToggle(true);
  var [showLiabilities, toggleShowLiabilities] = useToggle(true);
  var [state, setState] = useState({
    liquidAssets: [],
    investments: [],
    fixedAssets: [],
    shortTermLiabilities: [],
    longTermLiabilities: [],
  });

  useEffect(function() {
    getAllFromTable('accounts').then(function(accounts) {
      var overview = calculateFinanceOverview(accounts);
      setOverview(overview);
    });
    getEarliestSnapshot().then(function(accounts) {
      var overview = calculateFinanceOverview(accounts);
      overview.date_time = accounts[0].date_time;
      setEarliestSnapshot(overview);
    });
    getLatestSnapshot().then(function(accounts) {
      var overview = calculateFinanceOverview(accounts);
      overview.date_time = accounts[0].date_time;
      setLatestSnapshot(overview);
    });
  }, []);

  useEffect(
    function() {
      if (earliestSnapshot.date_time && overview.liquidity) {
        earliestSnapshot.date_time = moment(earliestSnapshot.date_time);
        const today = moment();
        const days = today.diff(earliestSnapshot.date_time, 'days');
        const changeInLiquidity =
          overview.liquidity - earliestSnapshot.liquidity;
        const changeInNetworth = overview.networth - earliestSnapshot.networth;
        setLiquidityRate(((changeInLiquidity / days) * 30).toFixed(2));
        setNetworthRate(((changeInNetworth / days) * 30).toFixed(2));
      }
    },
    [overview, earliestSnapshot]
  );

  var fetchData = useCallback(function() {
    getAllFromTable('accounts').then(function(accounts) {
      let liquidAssets = [],
        investments = [],
        fixedAssets = [],
        shortTermLiabilities = [],
        longTermLiabilities = [],
        totalAssetsBalance = 0,
        totalLiabilitiesBalance = 0;
      accounts.forEach(function(account) {
        switch (account.category) {
          case 'Liquid Assets':
            liquidAssets.push(account);
            totalAssetsBalance += account.balance;
            break;
          case 'Investments':
            investments.push(account);
            totalAssetsBalance += account.balance;
            break;
          case 'Fixed Assets':
            fixedAssets.push(account);
            totalAssetsBalance += account.balance;
            break;
          case 'Short Term Liabilities':
            shortTermLiabilities.push(account);
            totalLiabilitiesBalance += account.balance;
            break;
          case 'Long Term Liabilities':
            longTermLiabilities.push(account);
            totalLiabilitiesBalance += account.balance;
            break;
        }
      });
      setState({
        liquidAssets,
        investments,
        fixedAssets,
        shortTermLiabilities,
        longTermLiabilities,
        totalAssetsBalance,
        totalLiabilitiesBalance,
      });
    });
  }, []);

  return (
    <Screen>
      <NavigationEvents
        onWillFocus={function() {
          fetchData();
        }}
      />
      <ScrollView contentContainerStyle={{ marginHorizontal: 5 }}>
        <Card
          style={{
            marginTop: 5,
            marginHorizontal: 0,
          }}
          onPress={() => props.navigation.navigate('SnapshotList')}
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
                amount={overview.liquidity}
                style={{
                  fontSize: 15,
                  fontWeight: '500',
                  paddingBottom: 5,
                }}
              />
              <MoneyDisplay
                amount={overview.networth}
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
                amount={latestSnapshot.liquidity || 0}
                style={{
                  fontSize: 15,
                  fontWeight: '500',
                  paddingBottom: 5,
                }}
              />
              <MoneyDisplay
                amount={latestSnapshot.networth || 0}
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
                amount={(overview.liquidity + liquidityRate * 12).toFixed(2)}
                style={{
                  fontSize: 15,
                  fontWeight: '500',
                  paddingBottom: 5,
                }}
              />
              <MoneyDisplay
                amount={(overview.networth + networthRate * 12).toFixed(2)}
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
                amount={(overview.liquidity + liquidityRate * 36).toFixed(2)}
                style={{
                  fontSize: 15,
                  fontWeight: '500',
                  paddingBottom: 5,
                }}
              />
              <MoneyDisplay
                amount={(overview.networth + networthRate * 36).toFixed(2)}
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
                amount={(overview.liquidity + liquidityRate * 60).toFixed(2)}
                style={{
                  fontSize: 15,
                  fontWeight: '500',
                  paddingBottom: 5,
                }}
              />
              <MoneyDisplay
                amount={(overview.networth + networthRate * 60).toFixed(2)}
                style={{
                  fontSize: 15,
                  fontWeight: '500',
                  paddingBottom: 5,
                }}
              />
            </View>
          </View>
        </Card>

        <TouchableOpacity
          onPress={() => {
            toggleShowAssets();
            LayoutAnimation.easeInEaseOut();
          }}
          style={{
            paddingTop: 25,
            paddingBottom: 5,
          }}
        >
          <LineItem
            text="Total Assets"
            amount={state.totalAssetsBalance}
            textStyle={styles.total}
          />
        </TouchableOpacity>
        {showAssets && [
          <Category
            accounts={state.liquidAssets}
            name="Liquid"
            key="liquid"
            navigation={props.navigation}
          />,
          <Category
            accounts={state.investments}
            name="Investments"
            key="investments"
            navigation={props.navigation}
          />,
          <Category
            accounts={state.fixedAssets}
            name="Fixed"
            key="fixed"
            navigation={props.navigation}
          />,
        ]}

        <TouchableOpacity
          onPress={() => {
            toggleShowLiabilities();
            LayoutAnimation.easeInEaseOut();
          }}
          style={{ marginTop: 20, paddingTop: 25, paddingBottom: 5 }}
        >
          <LineItem
            text="Total Liabilities"
            amount={state.totalLiabilitiesBalance}
            textStyle={styles.total}
            negative
          />
        </TouchableOpacity>
        {showLiabilities && [
          <Category
            accounts={state.shortTermLiabilities}
            name="Short Term"
            key="short"
            negative
            navigation={props.navigation}
          />,
          <Category
            accounts={state.longTermLiabilities}
            name="Long Term"
            key="long"
            negative
            navigation={props.navigation}
          />,
        ]}
        <Pill
          onPress={() =>
            Alert.alert('Confirm', 'Do you want to create a new snapshot?', [
              {
                text: 'Cancel',
                onPress: function() {},
                style: 'cancel',
              },
              {
                text: 'Yes',
                onPress: buildAccountSnapshot(),
              },
            ])
          }
          label="Create snapshot"
          style={{
            padding: 12,
            marginTop: 25,
            marginHorizontal: 50,
          }}
          color={theme.colors.secondary}
          backgroundColor={theme.colors.primary}
          textStyle={{ textAlign: 'center' }}
        />
        <View style={{ paddingVertical: 25 }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  total: {
    fontSize: 17,
    fontWeight: 'bold',
  },
});

FinanceOverview.navigationOptions = () => ({
  headerTitle: 'Overview',
});

export default FinanceOverview;
