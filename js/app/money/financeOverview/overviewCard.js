import React from 'react';
import { Text, View } from 'react-native';
import Card from '../../../components/card';
import MoneyDisplay from '../../../components/moneyDisplay';
import theme from '../../../theme';

export default function OverviewCard({
  overview,
  navigation,
  latestSnapshot,
  liquidityRate,
  networthRate,
}) {
  return (
    <Card
      style={{
        marginVertical: 7,
        marginHorizontal: 0,
      }}
      onPress={() => navigation.navigate('SnapshotList')}
    >
      <View
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
            {new Date(latestSnapshot.date_time).toLocaleDateString()}
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
          marginTop: 10,
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
        </View>
      </View>
    </Card>
  );
}