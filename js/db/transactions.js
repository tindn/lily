import uuid from 'uuid/v1';
import { getMonthStartEndFor } from '../utils/date';
import { db, getAllFromTable, getById, queryResultToArray } from './shared';

var selectTransactionsStatement = `
  SELECT
      t.id,
      entry_type,
      amount,
      date_time,
      memo,
      v.name AS vendor,
      vendor_id,
      t.category
    FROM
      transactions t
      LEFT JOIN vendors v ON t.vendor_id = v.id
`;

function processTransactions(transactions) {
  transactions.forEach(function(t) {
    t.memo = unescape(t.memo);
    if (t.category) {
      t.category = unescape(t.category);
    }
    t.vendor = unescape(t.vendor);
  });
  return transactions;
}

export function getTransactionsFromTimestamp(timestamp) {
  return db
    .executeSql(
      `
    ${selectTransactionsStatement}
    WHERE
      date_time >= ${timestamp}
    ORDER BY
      date_time DESC;
  `
    )
    .then(queryResultToArray)
    .then(processTransactions);
}

export function getTransactionsBetweenTimestamps(from, to) {
  return db
    .executeSql(
      `
    ${selectTransactionsStatement}
    WHERE
      date_time >= ${from} AND date_time < ${to}
    ORDER BY
      date_time DESC;
  `
    )
    .then(queryResultToArray)
    .then(processTransactions);
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
 * @param {String} transaction.category
 */
export function addTransaction(transaction) {
  var transaction_id = uuid();
  var now = Date.now();
  var monthName = transaction.date_time.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
  });

  var vendor = 'NULL';
  if (transaction.vendor_id) {
    vendor = `'${transaction.vendor_id}'`;
  }

  var insertTransactionScript = `INSERT INTO transactions VALUES ('${transaction_id}', '${
    transaction.entry_type
  }', ${
    transaction.amount
  }, ${transaction.date_time.getTime()}, ${now}, ${now}, '${JSON.stringify(
    transaction.coords
  )}', '${escape(transaction.memo)}',${vendor}, '${escape(
    transaction.category
  )}');`;
  return getAllFromTable(
    'monthly_analytics',
    `WHERE name = '${monthName}'`
  ).then(function([monthlyAnalytics]) {
    var analyticsScript;
    var [monthStartDate, monthEndDate] = getMonthStartEndFor(
      transaction.date_time
    );
    if (!monthlyAnalytics) {
      var monthlyId = uuid();
      analyticsScript = `INSERT INTO monthly_analytics VALUES ('${monthlyId}', '${monthName}',${monthStartDate.getTime()}, ${monthEndDate.getTime()}, ${
        transaction.entry_type == 'credit' ? transaction.amount : 0
      }, ${transaction.entry_type == 'debit' ? transaction.amount : 0});`;
    } else {
      if (transaction.entry_type == 'credit') {
        monthlyAnalytics.earned = monthlyAnalytics.earned + transaction.amount;
      } else {
        monthlyAnalytics.spent = monthlyAnalytics.spent + transaction.amount;
      }
      analyticsScript = `UPDATE monthly_analytics SET earned = ${monthlyAnalytics.earned}, spent = ${monthlyAnalytics.spent} WHERE id = '${monthlyAnalytics.id}';`;
    }

    return db.sqlBatch([insertTransactionScript, analyticsScript]);
  });
}

/**
 *
 * @param {Object} transaction
 * @param {('credit' | 'debit')} transaction.entry_type
 * @param {Number} transaction.amount
 * @param {Number} transaction.date_time JS timestamp (use Date.getTime())
 * @param {String} transaction.memo
 * @param {String} transaction.vendor_id
 * @param {String} transaction.category
 */
export function updateTransaction(transaction) {
  var now = Date.now();
  var monthName = transaction.date_time.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
  });
  var vendor = 'NULL';
  if (transaction.vendor_id) {
    vendor = `'${transaction.vendor_id}'`;
  }
  var updateTransactionScript = `UPDATE transactions 
    SET entry_type = '${transaction.entry_type}', 
      amount = ${transaction.amount}, 
      date_time = ${transaction.date_time.getTime()},
      updated_on = ${now},
      memo = '${escape(transaction.memo)}',
      vendor_id = ${vendor},
      category = '${escape(transaction.category)}'
    WHERE id = '${transaction.id}';`;
  return getAllFromTable('monthly_analytics', `WHERE name = '${monthName}'`)
    .then(function([monthlyAnalytics]) {
      return getById('transactions', transaction.id).then(function([old]) {
        return [monthlyAnalytics, old];
      });
    })
    .then(function([monthlyAnalytics, oldTransaction]) {
      if (oldTransaction.entry_type == 'credit') {
        monthlyAnalytics.earned =
          monthlyAnalytics.earned - oldTransaction.amount;
      } else {
        monthlyAnalytics.spent = monthlyAnalytics.spent - oldTransaction.amount;
      }
      if (transaction.entry_type == 'credit') {
        monthlyAnalytics.earned = monthlyAnalytics.earned + transaction.amount;
      } else {
        monthlyAnalytics.spent = monthlyAnalytics.spent + transaction.amount;
      }
      var analyticsScript = `UPDATE monthly_analytics SET earned = ${monthlyAnalytics.earned}, spent = ${monthlyAnalytics.spent} WHERE id = '${monthlyAnalytics.id}';`;

      return db.sqlBatch([updateTransactionScript, analyticsScript]);
    });
}

export function deleteTransaction(transaction) {
  if (!(transaction.date_time instanceof Date)) {
    transaction.date_time = new Date(transaction.date_time);
  }
  var monthName = transaction.date_time.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
  });
  return getAllFromTable(
    'monthly_analytics',
    `WHERE name = '${monthName}'`
  ).then(function([monthlyAnalytics]) {
    if (transaction.entry_type == 'credit') {
      monthlyAnalytics.earned = monthlyAnalytics.earned - transaction.amount;
    } else {
      monthlyAnalytics.spent = monthlyAnalytics.spent - transaction.amount;
    }
    var analyticsScript = `UPDATE monthly_analytics SET earned = ${monthlyAnalytics.earned}, spent = ${monthlyAnalytics.spent} WHERE id = '${monthlyAnalytics.id}';`;

    return db.sqlBatch([
      `DELETE FROM transactions WHERE id = '${transaction.id}';`,
      analyticsScript,
    ]);
  });
}

/** @typedef SpendTracking
 * @type {Object}
 * @property {Number} spent
 * @property {Number} earned
 */

/**
 *
 * @param {Date} date any date of month
 * @returns {SpendTracking} spentTracking
 */
export async function getSpendTracking(from, to) {
  var results = await db
    .executeSql(
      `
  WITH month AS (
    SELECT
      *
    FROM
      transactions
    WHERE
      date_time >= ${from} AND date_time < ${to}
    ORDER BY
      date_time DESC
  ),
  cross AS (
    SELECT
      0 AS discretionary_spent,
      sum(amount) AS earned,
      0 AS spent
    FROM
      month
    WHERE
      entry_type = 'credit'
    UNION
    SELECT
      0 AS discretionary_spent,
      0 AS earned,
      sum(amount) AS spent
    FROM
      month
    WHERE
      entry_type = 'debit'
  )
  SELECT
    sum(earned) AS earned, sum(spent) AS spent, sum(discretionary_spent) AS discretionary_spent
  FROM
    cross;`
    )
    .then(queryResultToArray);
  return results[0];
}

export function getCategorySummary(from, to) {
  return db
    .executeSql(
      `
    SELECT
      category as name,
      sum(amount) as amount,
      entry_type
    FROM
      transactions
    WHERE
      date_time >= ${from} AND date_time < ${to}
    GROUP BY
      category, entry_type
     ORDER BY entry_type ASC, sum(amount) DESC;`
    )
    .then(queryResultToArray)
    .then(function(rows) {
      rows.forEach(function(r) {
        if (r.name == null) {
          r.name = 'No category';
        } else {
          r.name = unescape(r.name);
        }
      });
      return rows;
    });
}
