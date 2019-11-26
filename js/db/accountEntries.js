import uuid from 'uuid/v1';
import { db } from './shared';

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
  return db.sqlBatch([
    `INSERT INTO account_entries VALUES('${entry_id}',${entry.amount},'${escape(
      entry.memo
    )}','${escape(entry.entry_type)}',${entry.date_time},${now},NULL,'${
      entry.account_id
    }');`,
  ]);
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
  return db.sqlBatch([
    `UPDATE account_entries SET amount=${entry.amount},memo='${escape(
      entry.memo
    )}', entry_type='${escape(entry.entry_type)}', date_time=${
      entry.date_time
    }, updated_on=${now} WHERE id = '${entry.id}';`,
  ]);
}

export function removeAccountEntry(id) {
  return db.sqlBatch([`DELETE FROM account_entries WHERE id = '${id}';`]);
}
