import React from 'react';
import {
  Alert,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { connect } from 'react-redux';
import { deleteDocument, queryData } from '../../../firebaseHelper';
import { toWeekDayDateString } from '../../../utils/date';
import { formatAmountToDisplay } from '../../../utils/money';
import Screen from '../../components/screen';
import theme from '../../theme';
class MonthTransactions extends React.PureComponent {
  static getDerivedStateFromProps(props) {
    if (props.data && props.data.length) {
      return { data: props.data };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const today = new Date();
    this.startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.state = {
      refreshing: false,
      data: [],
    };
  }

  fetchData = () => {
    this.setState({ refreshing: true });
    queryData('transactions', [
      ['where', 'date', '>=', this.startOfMonth],
      ['orderBy', 'date', 'desc'],
    ])
      .then(this.props.updateMonthTransactions)
      .finally(() => {
        this.setState({
          refreshing: false,
        });
      });
  };

  render() {
    return (
      <Screen>
        <SwipeListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.fetchData}
            />
          }
          data={this.state.data}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <View style={styles.emptyComponent}>
              <Text>No transactions found.</Text>
            </View>
          }
          renderHiddenItem={data => (
            <View
              style={{
                backgroundColor: theme.colors.backgroundColor,
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}
            >
              <TouchableOpacity
                onPress={function() {
                  Alert.alert(
                    'Confirm',
                    'Do you want to delete this transaction?',
                    [
                      {
                        text: 'Cancel',
                      },
                      {
                        text: 'Delete',
                        onPress: function() {
                          deleteDocument('transactions', data.item.id);
                        },
                        style: 'destructive',
                      },
                    ]
                  );
                }}
                style={{
                  alignItems: 'center',
                  backgroundColor: theme.colors.red,

                  justifyContent: 'center',
                  width: 100,
                }}
              >
                <Text
                  style={{
                    fontWeight: '500',
                    fontSize: 15,
                    color: theme.colors.white,
                  }}
                >
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          )}
          rightOpenValue={-100}
          renderItem={({ item }) => {
            let dateDisplay = toWeekDayDateString(item.date);
            const color = item.isCredit ? theme.colors.green : theme.colors.red;
            return (
              <TouchableOpacity
                delayPressIn={100}
                style={styles.transactionItem}
                onPress={() => {
                  this.props.navigation.navigate('TransactionDetails', {
                    title: item.memo,
                    transaction: item,
                  });
                }}
              >
                <View>
                  <Text style={styles.transactionItemMemo}>
                    {(item.memo || item.vendor).slice(0, 25)}
                  </Text>
                  <Text style={styles.transactionItemDate}>{dateDisplay}</Text>
                </View>
                <Text style={[styles.transactionItemAmount, { color }]}>
                  {formatAmountToDisplay(item.amount)}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </Screen>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.monthTransactions,
  };
}

export default connect(mapStateToProps)(React.memo(MonthTransactions));

const styles = StyleSheet.create({
  emptyComponent: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  transactionItem: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundColor,
    borderBottomColor: theme.colors.lighterGray,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
  },
  transactionItemAmount: {
    fontSize: 20,
    fontWeight: '500',
  },
  transactionItemDate: {
    color: theme.colors.darkGray,
  },
  transactionItemMemo: {
    fontSize: 18,
    marginBottom: 8,
  },
});
