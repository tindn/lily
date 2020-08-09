import { Button, Text } from 'components';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import Screen from '../../../components/screen';
import { getVendorsArray } from '../../../redux/selectors/vendors';

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
          var numberOfLocations = 0;
          if (item.locations) {
            numberOfLocations = item.locations.length;
          }
          return (
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('VendorDetails', {
                  vendor: item,
                });
              }}
              style={{marginVertical: 7}}
              accessory={() => {
                return item.category ? (
                  <Button
                    disabled
                    style={{ paddingHorizontal: 7, paddingVertical: 3 }}
                    size="small"
                  >
                    {item.category}
                  </Button>
                ) : (
                  <View />
                );
              }}
            >
              <Text>{item.name}</Text>
              <Text>{numberOfLocations + ' location(s)'}</Text>
            </TouchableOpacity>
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

export default connect(mapStateToProps)(Vendors);
