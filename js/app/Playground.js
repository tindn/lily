import firebase from 'firebase';
import React from 'react';
import { View } from 'react-native';
import { Button, Layout, Text } from 'react-native-ui-kitten';
import Icon from 'react-native-vector-icons/AntDesign';
import uuid from 'uuid/v1';
import { db, runMigrations } from '../db';

export default function Playground() {
  return (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View>
        <Text>This is playground</Text>
      </View>
      <Button style={{ marginVertical: 5 }} onPress={() => runMigrations()}>
        Run Migrations
      </Button>
      <Button
        style={{ marginVertical: 5 }}
        onPress={() => {
          firebase.auth().signOut();
        }}
      >
        Sign out
      </Button>
      <Button
        style={{ marginVertical: 5 }}
        onPress={() => {
          fetch('http://localhost:5000/lily-cc62d/us-central1/vendors')
            .then(res => res.json())
            .then(async res => {
              res.forEach(processVendor);
            });
        }}
      >
        Sync Vendors
      </Button>
    </Layout>
  );
}

Playground.navigationOptions = () => ({
  // eslint-disable-next-line react/display-name
  tabBarIcon: ({ horizontal, tintColor }) => {
    return <Icon name="user" size={horizontal ? 20 : 25} color={tintColor} />;
  },
});

function processVendor(vendor) {
  var vendorId = uuid();
  var sqlBatch = [];

  var updated_script = 'datetime()';
  if (vendor._updatedOn) {
    updated_script = `datetime(${vendor._updatedOn._seconds}, 'unixepoch')`;
  }

  var insertVendorScript = `INSERT INTO vendors (id, name, updated_on_utc) VALUES ('${vendorId}','${vendor.id}', ${updated_script})`;
  sqlBatch.push(insertVendorScript);

  if (vendor.locations && vendor.locations.length) {
    let coordinates = vendor.locations
      .map(l => {
        var coordinateId = uuid();
        return `('${coordinateId}',${l.latitude},${l.longitude},'${vendorId}')`;
      })
      .join(',');
    var coordinatesScript = `INSERT INTO coordinates (id, latitude, longitude, vendor_id) VALUES ${coordinates}`;
    sqlBatch.push(coordinatesScript);
  }
  db.sqlBatch(sqlBatch).catch(e => {
    console.error(
      'An error occurred while creating vendor ' + vendor.id,
      e.message
    );
  });
}
