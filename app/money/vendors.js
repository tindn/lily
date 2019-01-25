import React from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { queryData } from '../../firebaseHelper';
import theme from '../../theme';
import Screen from '../screen';
import Icon from 'react-native-vector-icons/AntDesign';

class Vendors extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Vendors',
    headerRight: (
      <TouchableOpacity
        onPress={() => navigation.navigate('VendorDetails', {})}
        style={{ marginRight: 10 }}
      >
        <Icon name="plus" size={25} color={theme.colors.iosBlue} />
      </TouchableOpacity>
    ),
  });
  state = {
    refreshing: false,
  };

  fetchData = () => {
    this.setState({ refreshing: true });
    queryData('vendors', [])
      .then(this.props.updateVendors)
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
          data={this.props.vendors}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.fetchData}
            />
          }
          keyExtractor={item => item}
          ListEmptyComponent={
            <View style={styles.emptyComponent}>
              <Text>No vendors found.</Text>
            </View>
          }
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  this.props.navigation.navigate('VendorDetails', {
                    vendorId: item,
                  });
                }}
              >
                <View>
                  <Text style={styles.transactionItemMemo}>
                    {unescape(item)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  emptyComponent: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  item: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundColor,
    borderBottomColor: theme.colors.lighterGray,
    borderBottomWidth: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  transactionItemMemo: {
    fontSize: 18,
    marginBottom: 8,
  },
});

function mapStateToProps(state) {
  return {
    vendors: Object.keys(state.vendors).sort(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateVendors(vendors) {
      dispatch({
        type: 'UPDATE_VENDORS',
        payload: vendors,
      });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Vendors);
