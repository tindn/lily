import SQLite from 'react-native-sqlite-storage';

export var db;

export function queryResultToArray([results]) {
  var dataRows = [];
  var len = results.rows.length;
  for (let i = 0; i < len; i++) {
    let row = results.rows.item(i);
    dataRows.push(row);
  }
  return dataRows;
}

export function openDatabaseConnection(uid) {
  var userDatabaseFileName = 'lily-user-' + uid + '.db';
  return SQLite.openDatabase({
    name: userDatabaseFileName,
    location: 'Documents',
  }).then(DB => {
    db = DB;
    DB.executeSql('PRAGMA foreign_keys = ON;');
    DB.executeSql('PRAGMA journal_mode=DELETE;');
  });
}

export function closeDatabaseConnection() {
  if (!db) return;
  return db.close();
}

export function tableExists(tableName) {
  return db
    .executeSql(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`
    )
    .then(function([results]) {
      return results.rows.length > 0;
    });
}

export function getTransaction() {
  // eslint-disable-next-line no-undef
  return new Promise(function(resolve) {
    db.transaction(tx => {
      resolve(tx);
    });
  });
}

export function getAllFromTable(tableName, simpleCondition = '') {
  return db
    .executeSql(`SELECT * FROM ${tableName} ${simpleCondition};`)
    .then(queryResultToArray);
}

export function getById(tableName, id) {
  return db
    .executeSql(`SELECT * FROM ${tableName} WHERE id = '${id}';`)
    .then(queryResultToArray);
}
