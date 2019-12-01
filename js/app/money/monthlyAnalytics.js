import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Swipeable from 'react-native-swipeable-row';
import { NavigationEvents } from 'react-navigation';
import MoneyDisplay from '../../components/moneyDisplay';
import Screen from '../../components/screen';
import { calculateAnalyticsForMonth } from '../../db/monthlyAnalytics';
import { getAllFromTable } from '../../db/shared';
import { getCategorySummary } from '../../db/transactions';
import useToggle from '../../hooks/useToggle';
import sharedStyles from '../../sharedStyles';
import theme from '../../theme';

function MonthlyAnalytics(props) {
  const [data, setData] = useState([]);
  var [refreshing, setRefreshing] = useState(false);
  var [calculatingIndex, setCalculatingIndex] = useState(-1);
  var fetchData = useCallback(function(params = { useLoadingIndicator: true }) {
    params.useLoadingIndicator && setRefreshing(true);
    return getAllFromTable('monthly_analytics', 'ORDER BY start_date DESC')
      .then(setData)
      .finally(() => {
        params.useLoadingIndicator && setRefreshing(false);
      });
  }, []);

  return (
    <Screen>
      <NavigationEvents
        onWillFocus={function() {
          fetchData({ useLocadingIndicator: false });
        }}
      />
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
        ListEmptyComponent={
          <View style={styles.emptyComponent}>
            <Text>No data.</Text>
          </View>
        }
        renderItem={({ item, index }) => {
          return (
            <Swipeable
              rightActionActivationDistance={150}
              onRightActionRelease={function() {
                setCalculatingIndex(index);
                // eslint-disable-next-line no-undef
                setTimeout(function() {
                  calculateAnalyticsForMonth(item).then(() =>
                    fetchData({
                      useLoadingIndicator: false,
                    }).finally(function() {
                      setCalculatingIndex(-1);
                    })
                  );
                }, 300);
              }}
              rightContent={
                <View
                  key={`refresh ${item.id}`}
                  style={{
                    backgroundColor: theme.colors.green,
                    justifyContent: 'center',
                    flex: 1,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: '500',
                      fontSize: 18,
                      color: theme.colors.white,
                      paddingLeft: 10,
                    }}
                  >
                    Refresh
                  </Text>
                </View>
              }
            >
              <Month
                month={item}
                isCalculating={index == calculatingIndex}
                navigation={props.navigation}
              />
            </Swipeable>
          );
        }}
      />
    </Screen>
  );
}

MonthlyAnalytics.navigationOptions = {
  headerTitle: 'Monthly Analytics',
};

export default MonthlyAnalytics;

const styles = StyleSheet.create({
  emptyComponent: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
});

function Month({ month, navigation, isCalculating }) {
  const diff = month.earned - month.spent;
  var [showSummaries, toggleSummaries] = useToggle();
  var [summaries, setSummaries] = useState();
  var getSummaries = useCallback(
    function() {
      getCategorySummary(month.start_date, month.end_date).then(setSummaries);
    },
    [setSummaries]
  );

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          borderBottomColor: theme.colors.lighterGray,
          borderBottomWidth: 1,
        }}
      >
        <TouchableOpacity
          style={{
            alignItems: 'center',
            // backgroundColor: theme.colors.backgroundColor,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 8,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 8,
          }}
          onPress={() => {
            if (!showSummaries && summaries == undefined) {
              getSummaries();
            }
            toggleSummaries();
          }}
        >
          <View style={{ flex: 1 }}>
            <Text>{month.name}</Text>
            <MoneyDisplay amount={diff} />
          </View>
          <View style={{ flex: 1 }}>
            <MoneyDisplay amount={month.earned} />
            <MoneyDisplay
              amount={month.spent}
              style={{ color: theme.colors.red }}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            padding: 5,
            backgroundColor: theme.colors.secondary,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            navigation.navigate('MonthTransactions', {
              date: new Date(month.start_date),
            });
          }}
        >
          <Text style={{ paddingHorizontal: 10 }}>Transactions</Text>
          <ActivityIndicator style={{ width: 20 }} animating={isCalculating} />
        </TouchableOpacity>
      </View>
      {showSummaries && summaries ? (
        <View style={{ marginHorizontal: 10 }}>
          {summaries.map(function(category, index) {
            return (
              <View
                key={index.toString()}
                style={[
                  {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 5,
                  },
                  sharedStyles.borderBottom,
                ]}
              >
                <Text>{category.name}</Text>
                <MoneyDisplay
                  amount={category.amount}
                  useParentheses={false}
                  style={[
                    { fontSize: 16 },
                    category.entry_type == 'debit' && {
                      color: theme.colors.red,
                    },
                  ]}
                />
              </View>
            );
          })}
        </View>
      ) : null}
    </>
  );
}
