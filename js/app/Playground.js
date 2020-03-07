import firebase from 'firebase';
import React, { useContext } from 'react';
import { Clipboard, StatusBar } from 'react-native';
import { Button, Layout } from 'react-native-ui-kitten';
import Icon from 'react-native-vector-icons/AntDesign';
import rnfb from 'rn-fetch-blob';
import { runMigrations } from '../db';
import { upload } from '../LILYFirebaseStorage';
import CurrentUserContext from './currentUserContext';

export default function Playground() {
  var currentUser = useContext(CurrentUserContext);
  return (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <StatusBar barStyle="dark-content" />
      <Button
        style={{ marginVertical: 5 }}
        onPress={() => runMigrations()}
        disabled
      >
        Run Migrations
      </Button>

      <Button
        style={{ marginVertical: 5 }}
        onPress={function() {
          var dbFilePath =
            rnfb.fs.dirs.DocumentDir +
            '/lily-user-' +
            currentUser.user.uid +
            '.db';
          console.info(dbFilePath);
          Clipboard.setString(dbFilePath);
        }}
      >
        Db File Path
      </Button>
      <Button
        style={{ marginVertical: 5 }}
        disabled
        onPress={() => {
          // var storage = firebase.app().storage('gs://lily-cc62d.appspot.com');
          // var userDbBackupFolder = storage
          //   .ref()
          //   .child('db_backups/lily-user-' + currentUser.user.uid + '.db');
          var dbFilePath =
            rnfb.fs.dirs.DocumentDir +
            '/lily-user-' +
            currentUser.user.uid +
            '.db';
          upload('lily-user-' + currentUser.user.uid + '.db');
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

          // rnfb.polyfill.Blob.build(dbFilePath, { type: 'file' }).then(blob => {
          //   // upload image using Firebase SDK
          //   debugger;
          //   userDbBackupFolder
          //     .put(blob)
          //     .then(snapshot => {
          //       console.log('Uploaded', snapshot.totalBytes, 'bytes.');
          //       console.log(snapshot.metadata);
          //       var url = snapshot.metadata.downloadURLs[0];
          //       console.log('File available at', url);
          //     })
          //     .catch(function(error) {
          //       console.error('Upload failed:', error);
          //     });
          // });
        }}
      >
        Storage
      </Button>
      <Button
        style={{ marginVertical: 10 }}
        size="large"
        onPress={() => {
          firebase.auth().signOut();
        }}
      >
        SIGN OUT
      </Button>
    </Layout>
  );
}

Playground.navigationOptions = {
  // eslint-disable-next-line react/display-name
  tabBarIcon: ({ horizontal, tintColor }) => {
    return (
      <Icon name="setting" size={horizontal ? 20 : 25} color={tintColor} />
    );
  },
};
