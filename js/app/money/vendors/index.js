import React, { useCallback, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { NavigationEvents } from 'react-navigation';
import Screen from '../../../components/screen';
import { getAllVendors } from '../../../db';
import theme from '../../../theme';

function Vendors(props) {
  var [refreshing, setRefreshing] = useState(false);
  var [vendors, setVendors] = useState([]);
  var fetchData = useCallback(
    function(params = { useLoadingIndicator: true }) {
      params.useLoadingIndicator && setRefreshing(true);
      getAllVendors()
        .then(setVendors)
        .finally(() => {
          params.useLoadingIndicator && setRefreshing(false);
        });
    },
    [props.updateVendors]
  );

  return (
    <Screen>
      <NavigationEvents
        onWillFocus={function() {
          fetchData({ useLocadingIndicator: false });
        }}
      />
      <FlatList
        data={vendors}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
        keyExtractor={(item, index) => index.toString()}
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
                props.navigation.navigate('VendorDetails', {
                  vendor: item,
                });
              }}
            >
              <View>
                <Text style={styles.transactionItemMemo}>
                  {unescape(item.name)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </Screen>
  );
}

Vendors.navigationOptions = ({ navigation }) => ({
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

export default Vendors;
