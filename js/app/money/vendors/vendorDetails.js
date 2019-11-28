import geolocation from '@react-native-community/geolocation';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Button,
  Linking,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { cleanCoordinate } from '../../../utils/location';
import { createMapUrl } from '../../../utils/map';
import Pill from '../../../components/pill';
import Screen from '../../../components/screen';
import { addVendor, deleteVendor, saveVendor } from '../../../db/vendors';
import sharedStyles from '../../../sharedStyles';
import theme from '../../../theme';
import MapLocationInput from '../mapLocationInput';

function VendorDetails(props) {
  var [name, setName] = useState();
  var [id, setId] = useState();
  var [locations, setLocations] = useState([]);
  useState(function() {
    var vendor = props.navigation.getParam('vendor');
    if (vendor) {
      setName(unescape(vendor.name));
      setLocations(vendor.locations);
      setId(vendor.id);
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
            style={{ fontSize: 18 }}
            autoFocus={true}
          />
        </View>
        <View style={{ marginTop: 10, paddingLeft: 20 }}>
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
                <Pill
                  label="Go"
                  onPress={() => {
                    Linking.openURL(
                      createMapUrl({
                        travelMode: 'd',
                        q: name,
                        latitude: location.latitude,
                        longitude: location.longitude,
                      })
                    );
                  }}
                  style={{ padding: 12, marginHorizontal: 10 }}
                  color={theme.colors.secondary}
                  backgroundColor={theme.colors.primary}
                />
              </View>
            ))}
        </View>
        <View
          style={{
            paddingLeft: 40,
            paddingRight: 100,
          }}
        >
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
            style={{ padding: 12 }}
            color={theme.colors.secondary}
            backgroundColor={theme.colors.primary}
            textStyle={{ textAlign: 'center' }}
          />
        </View>
        <View style={[{ marginTop: 40 }, sharedStyles.actionButton]}>
          {id ? (
            <Button
              title="Save"
              onPress={() => {
                saveVendor({
                  id,
                  name,
                  locations,
                });
                props.navigation.pop();
              }}
            />
          ) : (
            <Button
              title="Add"
              onPress={() => {
                addVendor({
                  name,
                  locations,
                });
                props.navigation.pop();
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
                        deleteVendor(id);
                        props.navigation.pop();
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
    title:
      params && params.vendor ? unescape(params.vendor.name) : 'New Vendor',
  };
};

export default VendorDetails;
