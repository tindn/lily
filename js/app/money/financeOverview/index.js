import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { calculateFinanceOverview } from '../../../../utils/money';
import Card from '../../../components/card';
import MoneyDisplay from '../../../components/moneyDisplay';
import Screen from '../../../components/screen';
import {
  getEarliestSnapshot,
  getLatestSnapshot,
} from '../../../db/accountSnapshots';
import { getAllFromTable } from '../../../db/shared';
import theme from '../../../theme';

function FinanceOverview(props) {
  var [overview, setOverview] = useState({});
  var [earliestSnapshot, setEarliestSnapshot] = useState({});
  var [latestSnapshot, setLatestSnapshot] = useState({});
  var [liquidityRate, setLiquidityRate] = useState(0);
  var [networthRate, setNetworthRate] = useState(0);

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

  return (
    <Screen>
      <ScrollView>
        <Card
          style={{
            marginTop: 5,
          }}
          onPress={() => props.navigation.navigate('Accounts')}
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
      </ScrollView>
    </Screen>
  );
}

FinanceOverview.navigationOptions = ({ navigation }) => ({
  headerTitle: 'Overview',
  headerRight: (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('SnapshotList');
      }}
      style={{ marginRight: 10 }}
    >
      <Icon name="barschart" size={25} color={theme.colors.primary} />
    </TouchableOpacity>
  ),
});

export default FinanceOverview;
