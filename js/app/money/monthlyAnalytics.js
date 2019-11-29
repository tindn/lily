import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Swipeable from 'react-native-swipeable-row';
import { NavigationEvents } from 'react-navigation';
import Screen from '../../components/screen';
import { calculateAnalyticsForMonth } from '../../db/monthlyAnalytics';
import { getAllFromTable } from '../../db/shared';
import theme from '../../theme';
import { formatAmountToDisplay } from '../../utils/money';

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
          const diff = item.earned - item.spent;
          const color = diff >= 0 ? theme.colors.green : theme.colors.red;

          return (
            <Swipeable
              rightActionActivationDistance={150}
              onRightActionRelease={function() {
                setCalculatingIndex(index);
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
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => {
                  props.navigation.navigate('MonthTransactions', {
                    date: new Date(item.start_date),
                  });
                }}
              >
                <View>
                  <Text style={styles.month}>{item.name}</Text>
                  <Text style={{ color: theme.colors.green }}>
                    {` ${formatAmountToDisplay(item.earned)}`}
                  </Text>
                  <Text style={{ color: theme.colors.red }}>
                    {`${formatAmountToDisplay(-item.spent, true)}`}
                  </Text>
                </View>
                <ActivityIndicator animating={index == calculatingIndex} />
                <Text style={[styles.amount, { color }]}>
                  {formatAmountToDisplay(diff, true)}
                </Text>
              </TouchableOpacity>
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
