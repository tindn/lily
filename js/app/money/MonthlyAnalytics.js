import { useFocusEffect } from '@react-navigation/native';
import { Button, Text } from 'components';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import MoneyDisplay from '../../components/MoneyDisplay';
import Screen from '../../components/screen';
import { getTransactionSummaryByCategory } from '../../db/categories';
import { calculateAnalyticsForMonth } from '../../db/monthlyAnalytics';
import { getAllFromTable } from '../../db/shared';
import useToggle from '../../hooks/useToggle';
import sharedStyles from '../../sharedStyles';
import theme from '../../theme';

export default function MonthlyAnalytics(props) {
  const [data, setData] = useState([]);
  var [refreshing, setRefreshing] = useState(false);

  var fetchData = useCallback(function (
    params = { useLoadingIndicator: true }
  ) {
    params.useLoadingIndicator && setRefreshing(true);
    getAllFromTable('monthly_analytics', 'ORDER BY start_date DESC')
      .then(setData)
      .finally(() => {
        params.useLoadingIndicator && setRefreshing(false);
      });
  },
  []);

  useFocusEffect(fetchData);

  return (
    <Screen>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
        ListEmptyComponent={
          <View style={styles.emptyComponent}>
            <Text>No data.</Text>
          </View>
        }
        renderItem={({ item }) => {
          return (
            <Month
              month={item}
              navigation={props.navigation}
              fetchData={fetchData}
            />
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyComponent: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
});

function Month({ month, navigation, fetchData }) {
  const diff = month.earned - month.spent;
  var [showSummaries, toggleSummaries] = useToggle();
  var [summaries, setSummaries] = useState();
  var [isCalculating, setIsCalculating] = useState(false);
  var getSummaries = useCallback(
    function () {
      getTransactionSummaryByCategory(month.start_date, month.end_date).then(
        setSummaries
      );
    },
    [setSummaries]
  );

  return (
    <>
      <TouchableOpacity
        style={sharedStyles.listItem}
        onPress={() => {
          if (showSummaries) {
            toggleSummaries();
          } else {
            navigation.navigate('MonthTransactions', {
              date: new Date(month.start_date),
            });
          }
        }}
        onLongPress={() => {
          if (!showSummaries && summaries == undefined) {
            getSummaries();
          }
          toggleSummaries();
        }}
      >
        <View style={{ marginBottom: 10}}>
          <Text>{month.name}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flex: 1 }}>
            <MoneyDisplay amount={month.earned} type="credit" />
          </View>
          <View style={{ flex: 1 }}>
            <MoneyDisplay amount={month.spent} type="debit" />
          </View>
          <View style={{ flex: 1 }}>
            <MoneyDisplay amount={diff} />
          </View>
        </View>
      </TouchableOpacity>
      {showSummaries && summaries ? (
        <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
          {summaries.map(function (category, index) {
            return (
              <TouchableOpacity
                key={index.toString()}
                style={[
                  {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 5,
                  },
                  sharedStyles.borderBottom,
                ]}
                onPress={function () {
                  navigation.navigate('MonthTransactions', {
                    date: new Date(month.start_date),
                    category: category.name,
                  });
                }}
              >
                <Text>{category.name}</Text>
                <MoneyDisplay
                  amount={category.amount}
                  useParentheses={false}
                  type={category.entry_type}
                />
              </TouchableOpacity>
            );
          })}
          <Button
            style={{ marginTop: 20 }}
            color={theme.colors.green}
            onPress={() => {
              setIsCalculating(true);
              calculateAnalyticsForMonth(month).then(() => {
                setIsCalculating(false);
                fetchData({
                  useLoadingIndicator: false,
                });
              });
            }}
          >
            Refresh
          </Button>
          <ActivityIndicator
            style={{ width: 20, marginLeft: 10 }}
            animating={isCalculating}
          />
        </View>
      ) : null}
    </>
  );
}
