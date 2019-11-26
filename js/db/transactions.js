import uuid from 'uuid/v1';
import { db, queryResultToArray } from './shared';

export function getTransactionsFromDate(timestamp) {
  return db
    .executeSql(
      `
    SELECT
      t.id,
      entry_type,
      amount,
      date_time AS timestamp,
      memo,
      v.name AS vendor,
      vendor_id,
      is_discretionary
    FROM
      transactions t
      LEFT JOIN vendors v ON t.vendor_id = v.id
    WHERE
      date_time > ${timestamp}
    ORDER BY
      date_time DESC;
  `
    )
    .then(queryResultToArray);
}

/**
 *
 * @param {Object} transaction
 * @param {('credit' | 'debit')} transaction.entry_type
 * @param {Number} transaction.amount
 * @param {Number} transaction.date_time JS timestamp (use Date.getTime())
 * @param {Object} transaction.coords
 * @param {String} transaction.memo
 * @param {String} transaction.vendor_id
 * @param {Boolean} transaction.is_discretionary
 */
export function addTransaction(transaction) {
  var transaction_id = uuid();
  var now = Date.now();
  var script = `INSERT INTO transactions VALUES ('${transaction_id}', '${
    transaction.entry_type
  }', ${transaction.amount}, ${
    transaction.date_time
  }, ${now}, ${now}, '${JSON.stringify(transaction.coords)}', '${escape(
    transaction.memo
  )}', '${transaction.vendor_id}', ${transaction.is_discretionary});`;
  return db.sqlBatch([script]);
}

/**
 *
 * @param {Object} transaction
 * @param {('credit' | 'debit')} transaction.entry_type
 * @param {Number} transaction.amount
 * @param {Number} transaction.date_time JS timestamp (use Date.getTime())
 * @param {String} transaction.memo
 * @param {String} transaction.vendor_id
 * @param {Boolean} transaction.is_discretionary
 */
export function updateTransaction(transaction) {
  var now = Date.now();
  var script = `UPDATE transactions 
    SET entry_type = '${transaction.entry_type}', 
      amount = ${transaction.amount}, 
      date_time = ${transaction.date_time},
      updated_on = ${now},
      memo = '${escape(transaction.memo)}',
      vendor_id = '${transaction.vendor_id}',
      is_discretionary = ${transaction.is_discretionary}
    WHERE id = '${transaction.id}';`;
  return db.sqlBatch([script]);
}

export function deleteTransaction(id) {
  return db.sqlBatch([`DELETE FROM transactions WHERE id = '${id}';`]);
}
