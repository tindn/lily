import { db, queryResultToArray, getAllFromTable } from './shared';
import { getActiveAccounts } from './accounts';
import uuid from 'uuid/v1';

export function getAccountSnapshots() {
  return db
    .executeSql(
      `
    SELECT
      s.id,
      s.balance,
      s.date_time,
      a.name,
      a.category,
      a.type
    FROM
      account_snapshots s
      LEFT JOIN accounts a ON s.account_id = a.id
    ORDER BY s.date_time DESC;
    `
    )
    .then(queryResultToArray);
}

export function deleteAccountSnapshot(timestamp) {
  return db.executeSql(
    `
    DELETE FROM account_snapshots
    WHERE date_time = ${timestamp};
    `
  );
}

export function getEarliestSnapshot() {
  return db
    .executeSql(
      `
    SELECT
      s.id,
      s.balance,
      s.date_time,
      a.name,
      a.category,
      a.type
    FROM
      account_snapshots s
      LEFT JOIN accounts a ON s.account_id = a.id
    WHERE
      s.date_time = (
        SELECT
          date_time
        FROM
          account_snapshots
        GROUP BY
          date_time
        ORDER BY
          date_time ASC
        LIMIT 1);
    `
    )
    .then(queryResultToArray);
}

export function getLatestSnapshot() {
  return db
    .executeSql(
      `
    SELECT
      s.id,
      s.balance,
      s.date_time,
      a.name,
      a.category,
      a.type
    FROM
      account_snapshots s
      LEFT JOIN accounts a ON s.account_id = a.id
    WHERE
      s.date_time = (
        SELECT
          date_time
        FROM
          account_snapshots
        GROUP BY
          date_time
        ORDER BY
          date_time DESC
        LIMIT 1);
    `
    )
    .then(queryResultToArray);
}

export async function buildAccountSnapshot() {
  var activeAccounts = await getActiveAccounts();
  var timeOfSnapshot = Date.now();
  var scripts = activeAccounts.map(function(a) {
    return `INSERT INTO account_snapshots VALUES ('${uuid()}', ${a.balance}, ${timeOfSnapshot}, '${a.id}')`;
  });
  return db.sqlBatch(scripts);
}
