import { NativeModules } from 'react-native';
var FirebaseStorage = NativeModules.LILYFirebaseStorage;

export function upload(path) {
  FirebaseStorage.upload(path, function() {
    console.info('js land', arguments);
  });
}
