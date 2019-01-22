import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import theme from '../../theme';
import { formatAmountToDisplay } from '../../utils/money';
import Screen from '../screen';
import { queryData, watchData } from '../../firebaseHelper';

class MonthlyAnalytics extends React.PureComponent {
  static navigationOptions = {
    headerTitle: 'Monthly Analytics',
  };

  static getDerivedStateFromProps(props) {
    if (props.monthlyAnalytics) {
      const data = Object.values(props.monthlyAnalytics);
      data.sort((a, b) => b.startDate - a.startDate);
      return { data };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isRefreshing: true,
    };
  }

  fetchData = () => {
    this.setState({ refreshing: true });
    queryData('monthlyAnalytics')
      .then(this.props.updateMonthlyAnalytics)
      .finally(() => {
        this.setState({
          refreshing: false,
        });
      });
  };

  componentDidMount() {
    watchData('monthlyAnalytics', [], this.props.updateMonthlyAnalytics);
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
          renderItem={({ item }) => {
            const diff = item.earned - item.spent;
            const color = diff >= 0 ? theme.colors.green : theme.colors.red;
            return (
              <View style={styles.listItem}>
                <View>
                  <Text style={styles.month}>{item.id}</Text>
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
}

function mapStateToProps(state) {
  return {
    monthlyAnalytics: state.monthlyAnalytics,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateMonthlyAnalytics(analytics) {
      dispatch({
        type: 'UPDATE_MONTHLY_ANALYTICS',
        payload: analytics,
      });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MonthlyAnalytics);

const styles = StyleSheet.create({
  emptyComponent: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  listItem: {
    backgroundColor: theme.colors.backgroundColor,
    borderBottomColor: theme.colors.lighterGray,
    borderBottomWidth: 1,
    flex: 1,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  month: {
    fontSize: 18,
    marginBottom: 8,
  },
  amount: {
    fontSize: 20,
    fontWeight: '500',
  },
});
