import geolocation from '@react-native-community/geolocation';
import { Button, Input } from 'components';
import React, { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import CategoryInput from '../../../components/categoryInput';
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

var mapDispatchToProps = {
  addVendorToDb,
  saveVendorToDb,
  deleteVendorFromDb,
};

function VendorDetails(props) {
  var [name, setName] = useState();
  var [id, setId] = useState();
  var [locations, setLocations] = useState([]);
  var [category, setCategory] = useState('');
  useState(function () {
    var vendor = (props.route.params || {}).vendor;
    if (vendor) {
      setName(vendor.name);
      setLocations(vendor.locations || []);
      setId(vendor.id);
      setCategory(vendor.category);
    }
  });

  return (
    <Screen>
      <ScrollView keyboardShouldPersistTaps="always">
        <View
          style={[
            sharedStyles.formRow,
            sharedStyles.borderBottom,
            sharedStyles.formFirstRow,
            { paddingVertical: 20 },
          ]}
        >
          <Input
            value={name}
            placeholder="Name"
            onChangeText={setName}
            style={[sharedStyles.formTextInput, { textAlign: 'right' }]}
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
            onPress={function (name) {
              if (category == name) {
                setCategory('');
              } else {
                setCategory(name);
              }
            }}
            displayTextStyle={{ textAlign: 'right' }}
          />
        </View>

        <View style={{ marginTop: 10, paddingLeft: 20, paddingRight: 50 }}>
          {locations &&
            locations.map((location, index) => (
              <View
                key={index}
                style={{
                  height: 220,
                  marginBottom: 20,
                  flexDirection: 'row',
                }}
              >
                <MapLocationInput
                  coord={location}
                  title={name}
                  zoom={2500}
                  style={[sharedStyles.shadow2, { flex: 1 }]}
                  mapStyle={{ borderRadius: 10 }}
                  removeLocation={() => {
                    const newLocations = [...locations];
                    newLocations.splice(index, 1);
                    setLocations(newLocations);
                  }}
                  updateLocation={(e) => {
                    const newLocations = [...locations];
                    newLocations[index] = cleanCoordinate(
                      e.nativeEvent.coordinate
                    );
                    setLocations(newLocations);
                  }}
                  markerDraggable={true}
                />
              </View>
            ))}
          <Button
            status="basic"
            appearance="outline"
            onPress={() => {
              geolocation.getCurrentPosition(
                (position) => {
                  locations.push(position.coords);
                  setLocations([...locations]);
                },
                null,
                { enableHighAccuracy: false }
              );
            }}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              alignSelf: 'center',
            }}
          >
            Add location
          </Button>
        </View>

        {id ? (
          <Button
            color={theme.colors.iosBlue}
            style={{ marginTop: 40, marginHorizontal: 10 }}
            onPress={() => {
              props
                .saveVendorToDb({
                  id,
                  name,
                  locations,
                  category,
                })
                .then(function () {
                  props.navigation.pop();
                });
            }}
          >
            Save
          </Button>
        ) : (
          <Button
            onPress={() => {
              props
                .addVendorToDb({
                  name,
                  locations,
                  category,
                })
                .then(function () {
                  props.navigation.pop();
                });
            }}
          >
            Add
          </Button>
        )}
        {id && (
          <Button
            color={theme.colors.red}
            style={{ marginTop: 20, marginHorizontal: 10 }}
            onPress={() => {
              Alert.alert('Confirm', 'Do you want to delete this vendor?', [
                {
                  text: 'Cancel',
                  onPress: function () {},
                },
                {
                  text: 'Delete',
                  onPress: () => {
                    props.deleteVendorFromDb(id).then(function () {
                      props.navigation.pop();
                    });
                  },
                  style: 'destructive',
                },
              ]);
            }}
          >
            Delete
          </Button>
        )}
      </ScrollView>
    </Screen>
  );
}

export default connect(null, mapDispatchToProps)(VendorDetails);
