import SQLite from 'react-native-sqlite-storage';
import migrations from './migrations';
import { info, error } from '../log';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

export var db;

export function openDatabaseConnection() {
  db = SQLite.openDatabase({
    name: 'lily.db',
    location: 'Documents',
  }).then(DB => {
    db = DB;
    DB.executeSql(`PRAGMA foreign_keys = ON;`);
  });
}

export function closeDatabaseConnection() {
  if (!db) return;
  return db.close();
}

export async function runMigrations() {
  var migrationTableExists = await tableExists('db_migrations');
  if (!migrationTableExists) {
    var dbVersionTransaction = await getTransaction();
    await dbVersionTransaction.executeSql(`
            CREATE TABLE IF NOT EXISTS db_migrations (
              migration_index INTEGER PRIMARY KEY NOT NULL,
              migration_run_at_utc TEXT NOT NULL,
              migration_result BLOB
            );
          `);
  }
  var db_migrations = await getAllFromTable(
    'db_migrations',
    'ORDER BY migration_index DESC'
  );

  var latestVersion = -1; // no version
  if (db_migrations && db_migrations.length) {
    latestVersion = db_migrations[0].migration_index;
  }
  for (
    var migrationNumber = latestVersion + 1;
    migrationNumber < migrations.length;
    migrationNumber++
  ) {
    info('Running migration no.' + migrationNumber);
    var migration = migrations[migrationNumber];
    if (!migration) {
      continue;
    }
    try {
      await db.sqlBatch([
        migration,
        `INSERT INTO db_migrations values(${migrationNumber}, datetime(), NULL);`,
      ]);
    } catch (migrationError) {
      error('Migration number ' + migrationNumber + ' failed', migrationError);
    }
  }
}

function tableExists(tableName) {
  return db
    .executeSql(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`
    )
    .then(function([results]) {
      return results.rows.length > 0;
    });
}

function getTransaction() {
  // eslint-disable-next-line no-undef
  return new Promise(function(resolve) {
    db.transaction(tx => {
      resolve(tx);
    });
  });
}

function getAllFromTable(tableName, simpleCondition) {
  return db
    .executeSql(`SELECT * FROM ${tableName} ${simpleCondition};`)
    .then(function([results]) {
      var dataRows = [];
      var len = results.rows.length;
      for (let i = 0; i < len; i++) {
        let row = results.rows.item(i);
        dataRows.push(row);
      }
      return dataRows;
    });
}
