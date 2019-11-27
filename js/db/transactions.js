import uuid from 'uuid/v1';
import { db, queryResultToArray, getAllFromTable, getById } from './shared';

export function getTransactionsFromDate(timestamp) {
  return db
    .executeSql(
      `
    SELECT
      t.id,
      entry_type,
      amount,
      date_time,
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
  )}', '${escape(transaction.memo)}',${vendor}, ${
    transaction.is_discretionary
  });`;
  return getAllFromTable(
    'monthly_analytics',
    `WHERE name = '${monthName}'`
  ).then(function([monthlyAnalytics]) {
    var analyticsScript,
      monthStartDate = new Date(
        transaction.date_time.getFullYear(),
        transaction.date_time.getMonth(),
        1
      ),
      monthEndDate = nextMonth(monthStartDate);
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
 * @param {Boolean} transaction.is_discretionary
 */
export function updateTransaction(transaction) {
  var now = Date.now();
  var monthName = transaction.date_time.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
  });
  var updateTransactionScript = `UPDATE transactions 
    SET entry_type = '${transaction.entry_type}', 
      amount = ${transaction.amount}, 
      date_time = ${transaction.date_time.getTime()},
      updated_on = ${now},
      memo = '${escape(transaction.memo)}',
      vendor_id = '${transaction.vendor_id}',
      is_discretionary = ${transaction.is_discretionary}
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

function nextMonth(date) {
  const newDate = new Date(date);
  const currentMonth = newDate.getMonth();
  const currentYear = newDate.getFullYear();
  switch (currentMonth) {
    case 11:
      newDate.setMonth(0);
      newDate.setFullYear(currentYear + 1);
      break;
    default:
      newDate.setMonth(currentMonth + 1);
      break;
  }
  return newDate;
}
