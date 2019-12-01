import geolocation from '@react-native-community/geolocation';
import React, { useCallback, useState } from 'react';
import { Alert, Button, ScrollView, TextInput, View } from 'react-native';
import { connect } from 'react-redux';
import Pill from '../../../components/pill';
import Screen from '../../../components/screen';
import {
  addVendorToDb,
  deleteVendorFromDb,
  saveVendorToDb,
} from '../../../redux/actions/vendors';
import sharedStyles from '../../../sharedStyles';
import theme from '../../../theme';
import { cleanCoordinate } from '../../../utils/location';
import MapLocationInput from '../mapLocationInput';
import CategoryInput from '../../../components/categoryInput';

var mapDispatchToProps = {
  addVendorToDb: addVendorToDb,
  saveVendorToDb: saveVendorToDb,
  deleteVendorFromDb: deleteVendorFromDb,
};

function VendorDetails(props) {
  var [name, setName] = useState();
  var [id, setId] = useState();
  var [locations, setLocations] = useState([]);
  var [category, setCategory] = useState('');
  useState(function() {
    var vendor = props.navigation.getParam('vendor');
    if (vendor) {
      setName(vendor.name);
      setLocations(vendor.locations);
      setId(vendor.id);
      setCategory(vendor.category);
    }
  });

  var addLocation = useCallback(
    coord => {
      setLocations([...locations, coord]);
    },
    [setLocations]
  );

  var removeLocation = useCallback(index => {
    const newLocations = [...locations];
    newLocations.splice(index, 1);
    setLocations(newLocations);
  }, []);

  var updateLocation = useCallback((index, coord) => {
    const newLocations = [...locations];
    newLocations[index] = coord;
    setLocations(newLocations);
  }, []);

  return (
    <Screen style={{ alignContent: 'space-around' }}>
      <ScrollView keyboardShouldPersistTaps="always">
        <View
          style={[
            sharedStyles.formRow,
            sharedStyles.borderBottom,
            sharedStyles.formFirstRow,
            { paddingVertical: 20 },
          ]}
        >
          <TextInput
            value={name}
            placeholder="Name"
            onChangeText={setName}
            style={sharedStyles.formTextInput}
            autoFocus={!id}
            placeholderTextColor={theme.colors.lightGray}
          />
        </View>
        <View
          style={[
            sharedStyles.formRow,
            sharedStyles.borderBottom,
            { paddingVertical: 20 },
          ]}
        >
          <CategoryInput
            current={category}
            onPress={function(name) {
              if (category == name) {
                setCategory('');
              } else {
                setCategory(name);
              }
            }}
          />
        </View>

        <View style={{ marginTop: 10, paddingHorizontal: 20 }}>
          {locations &&
            locations.map((location, index) => (
              <View
                key={index}
                style={{
                  height: 220,
                  marginBottom: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <MapLocationInput
                  coord={location}
                  title={name}
                  style={[sharedStyles.shadow2, { flex: 1 }]}
                  mapStyle={{ borderRadius: 10 }}
                  removeLocation={() => {
                    removeLocation(index);
                  }}
                  updateLocation={e => {
                    updateLocation(
                      index,
                      cleanCoordinate(e.nativeEvent.coordinate)
                    );
                  }}
                  markerDraggable={true}
                />
              </View>
            ))}
        </View>
        <Pill
          onPress={() => {
            geolocation.getCurrentPosition(
              position => {
                addLocation(cleanCoordinate(position.coords));
              },
              null,
              { enableHighAccuracy: false }
            );
          }}
          label="Add location"
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            alignSelf: 'center',
          }}
          color={theme.colors.secondary}
          backgroundColor={theme.colors.primary}
          textStyle={{ textAlign: 'center' }}
        />
        <View style={[{ marginTop: 40 }, sharedStyles.actionButton]}>
          {id ? (
            <Button
              title="Save"
              onPress={() => {
                props
                  .saveVendorToDb({
                    id,
                    name,
                    locations,
                    category,
                  })
                  .then(function() {
                    props.navigation.pop();
                  });
              }}
            />
          ) : (
            <Button
              title="Add"
              onPress={() => {
                props
                  .addVendorToDb({
                    name,
                    locations,
                    category,
                  })
                  .then(function() {
                    props.navigation.pop();
                  });
              }}
            />
          )}
        </View>
        {id && (
          <View style={[sharedStyles.actionButton, { borderBottomWidth: 0 }]}>
            <Button
              title="Delete"
              onPress={() => {
                Alert.alert(
                  'Confirm',
                  'Do you want to delete this transaction?',
                  [
                    {
                      text: 'Cancel',
                      onPress: function() {},
                    },
                    {
                      text: 'Delete',
                      onPress: () => {
                        props.deleteVendorFromDb(id).then(function() {
                          props.navigation.pop();
                        });
                      },
                      style: 'destructive',
                    },
                  ]
                );
              }}
              color={theme.colors.red}
            />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

VendorDetails.navigationOptions = function({ navigation }) {
  const { params } = navigation.state;
  return {
    title: params && params.vendor ? params.vendor.name : 'New Vendor',
  };
};

export default connect(null, mapDispatchToProps)(VendorDetails);
