import firebase from 'firebase';
import React, { useContext } from 'react';
import { View } from 'react-native';
import { Button, Layout, Text } from 'react-native-ui-kitten';
import Icon from 'react-native-vector-icons/AntDesign';
import rnfb from 'rn-fetch-blob';
import uuid from 'uuid/v1';
import { db, runMigrations } from '../db';
import { getAllFromTable } from '../db/shared';
import CurrentUserContext from './currentUserContext';

export default function Playground() {
  var currentUser = useContext(CurrentUserContext);
  return (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View>
        <Text>This is playground</Text>
      </View>
      <Button
        style={{ marginVertical: 5 }}
        onPress={() => runMigrations()}
        disabled
      >
        Run Migrations
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
        disabled
      >
        Import Vendors
      </Button>
      <Button
        style={{ marginVertical: 5 }}
        onPress={importTransactions}
        disabled
      >
        Import Transactions
      </Button>
      <Button
        style={{ marginVertical: 5 }}
        onPress={() => {
          fetch('http://localhost:5000/lily-cc62d/us-central1/monthly')
            .then(res => res.json())
            .then(async res => {
              processMonthlies(res);
            });
        }}
        disabled
      >
        Import Monthly Analytics
      </Button>
      <Button style={{ marginVertical: 5 }} onPress={importAccounts} disabled>
        Import Accounts
      </Button>
      <Button
        style={{ marginVertical: 5 }}
        onPress={() => {
          fetch('http://localhost:5000/lily-cc62d/us-central1/accountSnapshots')
            .then(res => res.json())
            .then(async res => {
              processSnapshots(res);
            });
        }}
        disabled
      >
        Import Account Snapshots
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
          var storage = firebase.app().storage('gs://lily-cc62d.appspot.com');
          var userDbBackupFolder = storage
            .ref()
            .child('db_backups/lily-user-' + currentUser.user.uid + '.db');
          var dbFilePath =
            rnfb.fs.dirs.DocumentDir +
            '/lily-user-' +
            currentUser.user.uid +
            '.db';
          // rnfb.fs
          //   .readStream(
          //     rnfb.fs.dirs.DocumentDir +
          //       '/lily-user-' +
          //       currentUser.user.uid +
          //       '.db'
          //   )
          //   .then(function(stream) {
          //     stream.open();
          //     stream.onData(chunk => {
          //       console.log(chunk);
          //     });
          //     stream.onEnd(() => {
          //       console.log('end read');
          //     });
          // userDbBackupFolder.put(file).then(function(snapshot) {
          //   console.log('Uploaded a blob or file!');
          // });

          // rnfb.fs.stat(dbFilePath).then(function() {
          //   console.log(arguments);
          // });

          rnfb.polyfill.Blob.build(dbFilePath, { type: 'file' }).then(blob => {
            // upload image using Firebase SDK
            debugger;
            userDbBackupFolder
              .put(blob)
              .then(snapshot => {
                console.log('Uploaded', snapshot.totalBytes, 'bytes.');
                console.log(snapshot.metadata);
                var url = snapshot.metadata.downloadURLs[0];
                console.log('File available at', url);
              })
              .catch(function(error) {
                console.error('Upload failed:', error);
              });
          });
        }}
        disabled
      >
        Storage
      </Button>
    </Layout>
  );
}

Playground.navigationOptions = () => ({
  // eslint-disable-next-line react/display-name
  tabBarIcon: ({ horizontal, tintColor }) => {
    return (
      <Icon name="setting" size={horizontal ? 20 : 25} color={tintColor} />
    );
  },
});

function processVendor(vendor) {
  var vendorId = uuid();
  var sqlBatch = [];

  var updated_script = Date.now().toString();
  if (vendor._updatedOn) {
    var ms = vendor._updatedOn._nanoseconds / 1000000;
    var timestamp = vendor._updatedOn._seconds * 1000 + ms;
    updated_script = timestamp.toString();
  }

  var insertVendorScript = `INSERT INTO vendors (id, name, updated_on) VALUES ('${vendorId}','${vendor.id}', ${updated_script})`;
  sqlBatch.push(insertVendorScript);

  if (vendor.locations && vendor.locations.length) {
    let coordinates = vendor.locations
      .map(l => {
        var coordinateId = uuid();
        return `('${coordinateId}',${l.latitude},${l.longitude},'${vendorId}')`;
      })
      .join(',');
    var coordinatesScript = `INSERT INTO vendor_coordinates (id, latitude, longitude, vendor_id) VALUES ${coordinates}`;
    sqlBatch.push(coordinatesScript);
  }
  db.sqlBatch(sqlBatch).catch(e => {
    console.error(
      'An error occurred while creating vendor ' + vendor.id,
      e.message
    );
  });
}

async function importTransactions() {
  var allVendors = await getAllFromTable('vendors');
  var vendorLookup = allVendors.reduce((acc, v) => {
    acc[v.name] = v.id;
    return acc;
  }, {});
  var transactions = await fetch(
    'http://localhost:5000/lily-cc62d/us-central1/transactions'
  ).then(res => res.json());
  var scripts = transactions.map(t => {
    var ms = t.date._nanoseconds / 1000000;
    var timestamp = t.date._seconds * 1000 + ms;
    var addon_ms = t._addedOn._nanoseconds / 1000000;
    var addon_timestamp = t._addedOn._seconds * 1000 + addon_ms;
    var update_timestamp = 'NULL';
    if (t._updatedOn) {
      var update_ms = t._updatedOn._nanoseconds / 1000000;
      update_timestamp = t._updatedOn._seconds * 1000 + update_ms;
    }
    var vendorId = 'NULL';

    if (vendorLookup[escape(t.vendor)]) {
      vendorId = `'${vendorLookup[escape(t.vendor)]}'`;
    }
    var discretionary = t.isFixed ? 0 : 1;
    var transaction_id = uuid();
    return `
    INSERT INTO transactions VALUES ('${transaction_id}', '${t.entryType}', ${
      t.amount
    }, ${timestamp}, ${addon_timestamp}, ${update_timestamp}, '${JSON.stringify(
      t.coords
    )}', '${escape(t.memo)}', ${vendorId}, ${discretionary});`;
  });
  return db.sqlBatch(scripts);
}

function processMonthlies(monthlies) {
  var scripts = monthlies.map(function(m) {
    var id = uuid();
    var startDate =
      m.startDate._seconds * 1000 + m.startDate._nanoseconds / 1000000;
    var endDate = m.endDate._seconds * 1000 + m.endDate._nanoseconds / 1000000;
    m.earned = parseFloat(m.earned);
    m.spent = parseFloat(m.spent);
    return `
    INSERT INTO monthly_analytics VALUES ('${id}', '${m.id}', ${startDate}, ${endDate}, ${m.earned}, ${m.spent});
    `;
  });
  return db.sqlBatch(scripts);
}

async function importAccounts() {
  var accounts = await fetch(
    'http://localhost:5000/lily-cc62d/us-central1/accounts'
  ).then(res => res.json());
  var accountMap = accounts.reduce(function(acc, a) {
    a.entries = [];
    acc[a.id] = a;
    return acc;
  }, {});
  var accountEntries = await fetch(
    'http://localhost:5000/lily-cc62d/us-central1/accountEntries'
  ).then(res => res.json());
  accountEntries.forEach(function(e) {
    if (accountMap[e.accountId]) {
      accountMap[e.accountId].entries.push(e);
    } else {
      // console.log('no account found for ', e);
    }
  });
  var scripts = Object.values(accountMap).reduce(function(acc, a) {
    var account_id = uuid();
    var account_updated_on = Date.now().toString();
    if (a._updatedOn) {
      account_updated_on = a._updatedOn._seconds * 1000;
    }
    acc.push(
      `
      INSERT INTO accounts VALUES ('${account_id}','${a.name}','${a.type}', '${a.category}',${a.balance},${account_updated_on});`
    );
    if (a.entries && a.entries.length) {
      a.entries.forEach(function(e) {
        var entry_id = uuid();
        var entry_date = e.date._seconds * 1000 + e.date._nanoseconds / 1000000;
        var entry_updated = e._updatedOn._seconds * 1000;
        acc.push(
          `
          INSERT INTO account_entries VALUES ('${entry_id}',${e.amount},'${e.memo}','${e.type}',${entry_date},${entry_updated},NULL,'${account_id}');`
        );
      });
    }
    return acc;
  }, []);
  // console.log(scripts);
  db.sqlBatch(scripts);
}

async function processSnapshots(snapshots) {
  var accounts = await getAllFromTable('accounts');
  var accountLookupByName = accounts.reduce(function(acc, a) {
    acc[a.name] = a.id;
    return acc;
  }, {});
  var scripts = snapshots.reduce(function(acc, snap) {
    var snapshot_date =
      snap._updatedOn._seconds * 1000 + snap._updatedOn._nanoseconds / 1000000;
    Object.values(snap)
      .filter(a => a.name)
      .forEach(function(a) {
        var snapshot_id = uuid();
        acc.push(`
      INSERT INTO account_snapshots VALUES ('${snapshot_id}', ${a.balance}, ${snapshot_date},'${accountLookupByName[a.name]}');`);
      });
    return acc;
  }, []);
  db.sqlBatch(scripts);
}
