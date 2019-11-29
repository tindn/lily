import uuid from 'uuid/v1';
import { db, getById, getAllFromTable } from './shared';

export function getAccountEntriesForAccount(accountId) {
  return getAllFromTable(
    'account_entries',
    `WHERE account_id = '${accountId}' ORDER BY date_time DESC`
  ).then(function(entries) {
    entries.forEach(function(e) {
      e.memo = unescape(e.memo);
    });
    return entries;
  });
}

/**
 *
 * @param {Object} entry
 * @param {Number} entry.amount
 * @param {String} entry.memo
 * @param {"credit"|"debit"} entry.entry_type
 * @param {Number} entry.date_time timestamp
 * @param {String} entry.account_id
 */
export function addAccountEntry(entry) {
  var entry_id = uuid();
  var now = Date.now();
  return getById('accounts', entry.account_id).then(function([account]) {
    var newBalance = 0;
    if (entry.entry_type == 'credit') {
      newBalance = account.balance + entry.amount;
    } else {
      newBalance = account.balance - entry.amount;
    }
    db.sqlBatch([
      `INSERT INTO account_entries VALUES('${entry_id}',${
        entry.amount
      },'${escape(entry.memo)}','${escape(entry.entry_type)}',${
        entry.date_time
      },${now},NULL,'${entry.account_id}');`,
      `UPDATE accounts SET balance=${newBalance} WHERE id = '${entry.account_id}';`,
    ]);
  });
}

/**
 *
 * @param {Object} entry
 * @param {Number} entry.amount
 * @param {String} entry.memo
 * @param {"credit"|"debit"} entry.entry_type
 * @param {Number} entry.date_time timestamp
 */
export function updateAccountEntry(entry) {
  var now = Date.now();
  return getById('account_entries', entry.id)
    .then(function([entry]) {
      return getById('accounts', entry.account_id).then(function([account]) {
        return [entry, account];
      });
    })
    .then(function([oldEntry, account]) {
      var newBalance = account.balance;
      if (oldEntry.entry_type == 'credit') {
        newBalance = newBalance - oldEntry.amount;
      } else {
        newBalance = newBalance + oldEntry.amount;
      }
      if (entry.entry_type == 'credit') {
        newBalance = newBalance + entry.amount;
      } else {
        newBalance = newBalance - entry.amount;
      }

      return db.sqlBatch([
        `UPDATE account_entries SET amount=${entry.amount},memo='${escape(
          entry.memo
        )}', entry_type='${escape(entry.entry_type)}', date_time=${
          entry.date_time
        }, updated_on=${now} WHERE id = '${entry.id}';`,
        `UPDATE accounts SET balance=${newBalance} WHERE id = '${entry.account_id}';`,
      ]);
    });
}

export function removeAccountEntry(entry) {
  return getById('accounts', entry.account_id).then(function([account]) {
    var newBalance = 0;
    if (entry.entry_type == 'credit') {
      newBalance = account.balance - entry.amount;
    } else {
      newBalance = account.balance + entry.amount;
    }
    db.sqlBatch([
      `DELETE FROM account_entries WHERE id = '${entry.id}';`,
      `UPDATE accounts SET balance=${newBalance} WHERE id = '${entry.account_id}';`,
    ]);
  });
}
