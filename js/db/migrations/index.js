import { tableExists, getTransaction, getAllFromTable, db } from '../shared';
import migrations from './scripts';
import { error, info } from '../../log';

export default async function runMigrations() {
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
      await db.sqlBatch(
        migration.concat(
          `INSERT INTO db_migrations values(${migrationNumber}, datetime(), NULL);`
        )
      );
    } catch (migrationError) {
      error('Migration number ' + migrationNumber + ' failed', migrationError);
    }
  }
}
