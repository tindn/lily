import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import theme from '../../theme';
import {
  formatAmountToDisplay,
  getMonthlyAnalyticsFromSnapshot,
  getMonthlyAnalyticsQuery,
} from '../../utils';
import Screen from '../screen';

class MonthlyAnalytics extends React.PureComponent {
  constructor(props) {
    super(props);
    this.monthlyAnalyticsQuery = getMonthlyAnalyticsQuery([]);
    this.state = {
      data: [],
      isRefreshing: true,
    };
  }

  fetchData = () => {
    this.setState({ refreshing: true });
    this.monthlyAnalyticsQuery
      .get()
      .then(getMonthlyAnalyticsFromSnapshot)
      .then(data => {
        data.sort((a, b) => b.startDate - a.startDate);
        this.setState({ data });
      })
      .finally(() => {
        this.setState({
          refreshing: false,
        });
      });
  };

  componentDidMount() {
    this.monthlyAnalyticsQuery.onSnapshot(snapshot => {
      const data = getMonthlyAnalyticsFromSnapshot(snapshot);
      data.sort((a, b) => b.startDate - a.startDate);
      this.setState({ data });
    });
  }

  render() {
    return (
      <Screen>
        <FlatList
          data={this.state.data}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.fetchData}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyComponent}>
              <Text>No data.</Text>
            </View>
          }
          renderItem={({ item, index }) => {
            const borderBottomWidth =
              index === this.state.data.length - 1 ? 0 : 1;
            const diff = item.earned - item.spent;
            const color = diff >= 0 ? theme.colors.green : theme.colors.red;
            return (
              <View style={[styles.listItem, { borderBottomWidth }]}>
                <View>
                  <Text style={styles.transactionItemMemo}>{item.id}</Text>
                  <Text style={{ color: theme.colors.green }}>
                    {` ${formatAmountToDisplay(item.earned)}`}
                  </Text>
                  <Text style={{ color: theme.colors.red }}>
                    {`${formatAmountToDisplay(-item.spent, true)}`}
                  </Text>
                </View>
                <Text style={[styles.transactionItemAmount, { color }]}>
                  {formatAmountToDisplay(diff, true)}
                </Text>
              </View>
            );
          }}
        />
      </Screen>
    );
  }
}

export default React.memo(MonthlyAnalytics);

const styles = StyleSheet.create({
  emptyComponent: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  listItem: {
    backgroundColor: '#fff',
    borderBottomColor: theme.colors.lighterGray,
    flex: 1,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionItemMemo: {
    fontSize: 18,
    marginBottom: 8,
  },
  transactionItemDate: {
    color: theme.colors.darkGray,
  },
  transactionItemAmount: {
    fontSize: 20,
    fontWeight: '500',
  },
});
