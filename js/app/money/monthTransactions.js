import React from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Swipeable from 'react-native-swipeable-row';
import Icon from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import { deleteDocument, queryData } from '../../../firebaseHelper';
import { toWeekDayDateString } from '../../../utils/date';
import { formatAmountToDisplay } from '../../../utils/money';
import Screen from '../../components/screen';
import theme from '../../theme';

class MonthTransactions extends React.PureComponent {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: new Date().toLocaleDateString('en-US', {
      month: 'long',
    }),
    headerRight: (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('MonthSetup');
        }}
        style={{ marginRight: 10 }}
      >
        <Icon name="profile" size={25} color={theme.colors.primary} />
      </TouchableOpacity>
    ),
  });

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
        <FlatList
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
          renderItem={({ item }) => {
            let dateDisplay = toWeekDayDateString(item.date);
            const color = item.isCredit ? theme.colors.green : theme.colors.red;
            return (
              <Swipeable
                rightButtons={[
                  <TouchableOpacity
                    key={`delete ${item.id}`}
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
                              deleteDocument('transactions', item.id);
                            },
                            style: 'destructive',
                          },
                        ]
                      );
                    }}
                    style={{
                      backgroundColor: theme.colors.red,
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
                      Delete
                    </Text>
                  </TouchableOpacity>,
                ]}
              >
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
                    <Text style={styles.transactionItemDate}>
                      {dateDisplay}
                    </Text>
                  </View>
                  {item.isFixed && (
                    <View
                      style={{
                        backgroundColor: theme.colors.lighterGray,
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: theme.colors.lightGray,
                        padding: 5,
                      }}
                    >
                      <Text style={{ color: theme.colors.lightGray }}>
                        FIXED
                      </Text>
                    </View>
                  )}
                  <Text style={[styles.transactionItemAmount, { color }]}>
                    {formatAmountToDisplay(item.amount)}
                  </Text>
                </TouchableOpacity>
              </Swipeable>
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

export default connect(mapStateToProps)(MonthTransactions);

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
