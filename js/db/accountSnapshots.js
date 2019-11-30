import { db, queryResultToArray } from './shared';

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

export function buildAccountSnapshot() {}
