import { useFocusEffect } from '@react-navigation/native';
import { Button } from 'components';
import { differenceInCalendarDays } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { BarChart, LineChart, YAxis } from 'react-native-svg-charts';
import Screen from '../../../components/screen';
import { getActiveAccounts } from '../../../db/accounts';
import {
  buildAccountSnapshot,
  getAccountSnapshots,
  getEarliestSnapshot,
  getLatestSnapshot,
} from '../../../db/accountSnapshots';
import { useToggle } from '../../../hooks';
import { error, success } from '../../../log';
import theme from '../../../theme';
import {
  calculateFinanceOverview,
  formatAmountToDisplay,
} from '../../../utils/money';
import Category from './category';
import LineItem from './lineItem';
import OverviewCard from './overviewCard';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function FinanceOverview(props) {
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
    retirements: [],
  });
  var [allSnapshots, setAllSnapshots] = useState([]);
  var windowWidth = useWindowDimensions().width;
  useEffect(
    function () {
      if (earliestSnapshot.date_time && overview.liquidity) {
        const days = differenceInCalendarDays(
          new Date(),
          new Date(earliestSnapshot.date_time)
        );
        const changeInLiquidity =
          overview.liquidity - earliestSnapshot.liquidity;
        const changeInNetworth = overview.networth - earliestSnapshot.networth;
        setLiquidityRate(((changeInLiquidity / days) * 30).toFixed(2));
        setNetworthRate(((changeInNetworth / days) * 30).toFixed(2));
      }
    },
    [overview, earliestSnapshot]
  );

  var fetchData = useCallback(function () {
    getActiveAccounts().then(function (accounts) {
      var overview = calculateFinanceOverview(accounts);
      setOverview(overview);
      let liquidAssets = [],
        investments = [],
        fixedAssets = [],
        shortTermLiabilities = [],
        longTermLiabilities = [],
        retirements = [],
        totalAssetsBalance = 0,
        totalLiabilitiesBalance = 0;
      accounts.forEach(function (account) {
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
          case 'Retirement':
            retirements.push(account);
        }
      });
      setState({
        liquidAssets,
        investments,
        fixedAssets,
        shortTermLiabilities,
        longTermLiabilities,
        retirements,
        totalAssetsBalance,
        totalLiabilitiesBalance,
      });
    });
    getEarliestSnapshot().then(function (accounts) {
      var overview = calculateFinanceOverview(accounts);
      overview.date_time = accounts[0].date_time;
      setEarliestSnapshot(overview);
    });
    getLatestSnapshot().then(function (accounts) {
      var overview = calculateFinanceOverview(accounts);
      overview.date_time = accounts[0].date_time;
      setLatestSnapshot(overview);
    });
    getAccountSnapshots('ASC')
      .then(function (accountSnapshots) {
        var snapshots = accountSnapshots.reduce(function (
          acc,
          accountSnapshot
        ) {
          if (!acc[accountSnapshot.date_time]) {
            acc[accountSnapshot.date_time] = [];
          }
          acc[accountSnapshot.date_time].push(accountSnapshot);
          return acc;
        },
        {});
        return Object.entries(snapshots).map(function (snap) {
          var overview = calculateFinanceOverview(snap[1]);
          overview.date_time = snap[0];
          return overview;
        });
      })
      .then((snapshots) => {
        console.log(snapshots[0]);
        setAllSnapshots(snapshots);
      });
  }, []);

  useFocusEffect(fetchData);
  var graphInsets = {
    left: 30,
    right: 30,
  };
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ marginHorizontal: 5 }}>
        <ScrollView style={{ marginBottom: 20 }} horizontal>
          <OverviewCard
            overview={overview}
            navigation={props.navigation}
            latestSnapshot={latestSnapshot}
            liquidityRate={liquidityRate}
            networthRate={networthRate}
            style={{ width: windowWidth }}
          />
          <TouchableOpacity
            style={{ marginTop: 10, height: 230, width: windowWidth }}
            onPress={() => props.navigation.navigate('SnapshotList')}
          >
            <View
              style={{
                position: 'absolute',
                width: '100%',
                height: 240,
                flexDirection: 'row',
              }}
            >
              <BarChart
                style={{ height: 230, width: '100%', position: 'absolute' }}
                data={allSnapshots}
                yAccessor={({ item }) => item.liquidity}
                contentInset={graphInsets}
                svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
              ></BarChart>
              <YAxis
                data={allSnapshots}
                yAccessor={({ item }) => item.liquidity}
                svg={{
                  fill: theme.colors.darkerGray,
                  fontSize: 10,
                  fontWeight: 'bold',
                }}
                numberOfTicks={10}
                formatLabel={(value) => `$${value / 1000}k`}
              />
            </View>
            <View
              style={{
                height: 230,
                flexDirection: 'row',
                paddingLeft: 10,
                justifyContent: 'flex-end',
              }}
            >
              <LineChart
                style={{ height: 230, width: '100%', position: 'absolute' }}
                data={allSnapshots}
                yAccessor={({ item }) => item.networth}
                svg={{ stroke: theme.colors.green, strokeWidth: 3 }}
                contentInset={graphInsets}
              ></LineChart>
              <YAxis
                data={allSnapshots}
                yAccessor={({ item }) => item.networth}
                svg={{
                  fill: theme.colors.darkerGray,
                  fontSize: 10,
                  fontWeight: 'bold',
                }}
                numberOfTicks={10}
                formatLabel={(value) => `$${value / 1000}k`}
              />
            </View>
          </TouchableOpacity>
        </ScrollView>

        <Category
          accounts={state.retirements}
          name="Retirements"
          key="retirements"
          navigation={props.navigation}
        />
        <LineItem
          onPress={() => {
            toggleShowAssets();
            LayoutAnimation.easeInEaseOut();
          }}
          style={{
            marginTop: 20,
            marginBottom: 5,
          }}
          text="Total Assets"
          amount={state.totalAssetsBalance}
          textStyle={styles.total}
        />
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
        <LineItem
          onPress={() => {
            toggleShowLiabilities();
            LayoutAnimation.easeInEaseOut();
          }}
          style={{ marginTop: 20, marginBottom: 5 }}
          text="Total Liabilities"
          amount={state.totalLiabilitiesBalance}
          textStyle={styles.total}
          negative
        />
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

        <Button
          onPress={() =>
            Alert.alert('Confirm', 'Do you want to create a new snapshot?', [
              {
                text: 'Cancel',
                onPress: function () {},
                style: 'cancel',
              },
              {
                text: 'Yes',
                onPress: function () {
                  buildAccountSnapshot()
                    .then(function () {
                      success('Snapshot created');
                    })
                    .catch(function (e) {
                      error('Error creating snapshot', e.message);
                    })
                    .finally(fetchData);
                },
              },
            ])
          }
          style={{
            padding: 12,
            marginTop: 25,
            marginHorizontal: 50,
          }}
        >
          Create Snapshot
        </Button>
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
