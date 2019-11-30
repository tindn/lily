import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Pill from '../../../components/pill';
import Screen from '../../../components/screen';
import { getActiveAccounts } from '../../../db/accounts';
import {
  buildAccountSnapshot,
  getEarliestSnapshot,
  getLatestSnapshot,
} from '../../../db/accountSnapshots';
import { useToggle } from '../../../hooks';
import theme from '../../../theme';
import { calculateFinanceOverview } from '../../../utils/money';
import Category from './category';
import LineItem from './lineItem';
import OverviewCard from './overviewCard';

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
    getActiveAccounts().then(function(accounts) {
      var overview = calculateFinanceOverview(accounts);
      setOverview(overview);
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

  return (
    <Screen>
      <NavigationEvents
        onWillFocus={function() {
          fetchData();
        }}
      />
      <ScrollView contentContainerStyle={{ marginHorizontal: 5 }}>
        <OverviewCard
          overview={overview}
          navigation={props.navigation}
          latestSnapshot={latestSnapshot}
          liquidityRate={liquidityRate}
          networthRate={networthRate}
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
