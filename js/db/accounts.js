import { getAllFromTable, getById, db } from './shared';

export function getAccountById(id) {
  return getById('accounts', id).then(function(data) {
    data[0].name = unescape(data[0].name);
    return data[0];
  });
}

export async function updateBalanceForAccount(id) {
  var allEntries = await getAllFromTable(
    'account_entries',
    `WHERE account_id = '${id}' ORDER BY date_time ASC`
  );
  var newBalance = allEntries.reduce(function(acc, e) {
    if (e.entry_type == 'debit') {
      acc = acc - e.amount;
    } else {
      acc = acc + e.amount;
    }
    return acc;
  }, 0);
  return db.executeSql(
    `UPDATE accounts SET balance = ${newBalance} WHERE id = '${id}'`
  );
}

export function getActiveAccounts() {
  return getAllFromTable('accounts', 'WHERE is_archived = false');
}

export function archiveAccount(id) {
  return db.executeSql(
    `UPDATE accounts SET is_archived = 1 WHERE id = '${id}';`
  );
}

export function unarchivedAccount(id) {
  return db.executeSql(
    `UPDATE accounts SET is_archived = 0 WHERE id = '${id}';`
  );
}
