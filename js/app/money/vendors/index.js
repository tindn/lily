import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import Screen from '../../../components/screen';
import { getVendorsArray } from '../../../redux/selectors/vendors';
import theme from '../../../theme';
import OutlineButton from '../../../components/outlineButton';

function mapStateToProps(state) {
  return {
    vendors: getVendorsArray(state),
  };
}

function Vendors(props) {
  return (
    <Screen>
      <FlatList
        data={props.vendors}
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
              <Text style={styles.transactionItemMemo}>{item.name}</Text>
              {item.category ? (
                <OutlineButton
                  disabled
                  label={item.category}
                  style={{ paddingHorizontal: 7, paddingVertical: 3 }}
                />
              ) : null}
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

export default connect(mapStateToProps)(Vendors);
