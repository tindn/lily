import { Button } from 'components';
import firebase from 'firebase';
import React, { useContext } from 'react';
import { Clipboard, Image } from 'react-native';
import rnfb from 'rn-fetch-blob';
import BottomSheet from '../../components/bottomSheet';
import Screen from '../../components/screen';
import { runMigrations } from '../../db';
import { useToggle } from '../../hooks';
import { upload } from '../../LILYFirebaseStorage';
import CurrentUserContext from '../currentUserContext';

function Home(props) {
  var currentUser = useContext(CurrentUserContext);
  var [showContact, toggleContact] = useToggle();
  return (
    <Screen style={{ justifyContent: 'center', alignItems: 'center' }}>
      {__DEV__ ? (
        <>
          <Button
            style={{ marginVertical: 5 }}
            onPress={() => runMigrations()}
            disabled
          >
            Run Migrations
          </Button>

          <Button
            style={{ marginVertical: 5 }}
            onPress={function () {
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
        </>
      ) : null}
      <Button
        size='large'
        style={{ marginVertical: 20 }}
        onPress={() => props.navigation.navigate('LargeDisplay')}
      >
        Large Display
      </Button>
      <Button
        style={{ marginVertical: 10 }}
        size='large'
        onPress={toggleContact}
      >
        Contact
      </Button>
      <Button
        style={{ marginVertical: 10 }}
        onPress={() => props.navigation.navigate('Vendors')}
      >
        Vendors
      </Button>
      <Button
        style={{ marginVertical: 10 }}
        onPress={() => props.navigation.navigate('Categories')}
      >
        Categories
      </Button>
      <Button
        style={{ marginVertical: 10 }}
        size='large'
        onPress={() => {
          firebase.auth().signOut();
        }}
      >
        Sign Out
      </Button>
      <BottomSheet show={showContact} hide={toggleContact}>
        <Image
          // eslint-disable-next-line no-undef
          source={require('../../../images/contact.png')}
          style={{ width: 320, height: 320, alignSelf: 'center', margin: 20 }}
        />
      </BottomSheet>
    </Screen>
  );
}

export default Home;
