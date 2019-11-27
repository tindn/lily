import SQLite from 'react-native-sqlite-storage';
import runMigrations from './migrations';
import { closeDatabaseConnection, db, openDatabaseConnection } from './shared';
import { getAllVendors } from './vendors';
export {
  closeDatabaseConnection,
  openDatabaseConnection,
  db,
  runMigrations,
  getAllVendors,
};

// if (__DEV__) {
//   SQLite.DEBUG(true);
// }
SQLite.enablePromise(true);
