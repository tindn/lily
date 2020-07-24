import { useFocusEffect } from '@react-navigation/native';
import { ListItem, Text } from '@ui-kitten/components';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Swipeable from 'react-native-swipeable-row';
import MoneyDisplay from '../../components/MoneyDisplay';
import Screen from '../../components/screen';
import { getTransactionSummaryByCategory } from '../../db/categories';
import { calculateAnalyticsForMonth } from '../../db/monthlyAnalytics';
import { getAllFromTable } from '../../db/shared';
import useToggle from '../../hooks/useToggle';
import sharedStyles from '../../sharedStyles';
import { useThemeColors } from '../../uiKittenTheme';

export default function MonthlyAnalytics(props) {
  const [data, setData] = useState([]);
  var [refreshing, setRefreshing] = useState(false);
  var [calculatingIndex, setCalculatingIndex] = useState(-1);
  var themeColors = useThemeColors();

  var fetchData = useCallback(function(params = { useLoadingIndicator: true }) {
    params.useLoadingIndicator && setRefreshing(true);
    return getAllFromTable('monthly_analytics', 'ORDER BY start_date DESC')
      .then(setData)
      .finally(() => {
        params.useLoadingIndicator && setRefreshing(false);
      });
  }, []);

  useFocusEffect(function() {
    fetchData({ useLocadingIndicator: false });
  });

  return (
    <Screen>
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
                    backgroundColor: themeColors.textSuccessColor,
                    justifyContent: 'center',
                    flex: 1,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: '500',
                      fontSize: 18,
                      color: '#fff',
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
      getTransactionSummaryByCategory(month.start_date, month.end_date).then(
        setSummaries
      );
    },
    [setSummaries]
  );

  return (
    <>
      <ListItem
        style={[
          sharedStyles.borderBottom,
          {
            alignItems: 'center',
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 8,
            paddingLeft: 10,
            paddingRight: 10,
          },
        ]}
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
        <View style={{ flex: 1 }}>
          <Text>{month.name}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <MoneyDisplay amount={diff} />
          <ActivityIndicator
            style={{ width: 20, marginLeft: 10 }}
            animating={isCalculating}
          />
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <MoneyDisplay amount={month.earned} type="credit" />
          <MoneyDisplay amount={month.spent} type="debit" />
        </View>
      </ListItem>
      {showSummaries && summaries ? (
        <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
          {summaries.map(function(category, index) {
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
                onPress={function() {
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
        </View>
      ) : null}
    </>
  );
}
