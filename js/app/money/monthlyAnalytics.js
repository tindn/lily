import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { formatAmountToDisplay } from '../../utils/money';
import Screen from '../../components/screen';
import { getAllFromTable } from '../../db/shared';
import theme from '../../theme';

function MonthlyAnalytics() {
  const [data, setData] = useState([]);
  var [refreshing, setRefreshing] = useState(false);
  var fetchData = useCallback(function(params = { useLoadingIndicator: true }) {
    params.useLoadingIndicator && setRefreshing(true);
    getAllFromTable('monthly_analytics', 'ORDER BY start_date DESC')
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
        renderItem={({ item }) => {
          const diff = item.earned - item.spent;
          const color = diff >= 0 ? theme.colors.green : theme.colors.red;
          return (
            <View style={styles.listItem}>
              <View>
                <Text style={styles.month}>{item.name}</Text>
                <Text style={{ color: theme.colors.green }}>
                  {` ${formatAmountToDisplay(item.earned)}`}
                </Text>
                <Text style={{ color: theme.colors.red }}>
                  {`${formatAmountToDisplay(-item.spent, true)}`}
                </Text>
              </View>
              <Text style={[styles.amount, { color }]}>
                {formatAmountToDisplay(diff, true)}
              </Text>
            </View>
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
  amount: {
    fontSize: 20,
    fontWeight: '500',
  },
  emptyComponent: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  listItem: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundColor,
    borderBottomColor: theme.colors.lighterGray,
    borderBottomWidth: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
  },
  month: {
    fontSize: 18,
    marginBottom: 8,
  },
});
