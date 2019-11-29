import { db } from './shared';
import { getTransactionsBetweenTimestamps } from './transactions';

export async function calculateAnalyticsForMonth(monthlyAnalytics) {
  var monthTransactions = await getTransactionsBetweenTimestamps(
    monthlyAnalytics.start_date,
    monthlyAnalytics.end_date
  );
  var spent = 0,
    earned = 0;
  for (var i = 0; i < monthTransactions.length; i++) {
    var t = monthTransactions[i];
    if (t.entry_type == 'debit') {
      spent = spent + t.amount;
    } else {
      earned = earned + t.amount;
    }
  }
  spent = spent.toFixed(2);
  earned = earned.toFixed(2);

  return db.sqlBatch([
    `UPDATE monthly_analytics SET earned = ${earned}, spent = ${spent} WHERE id = '${monthlyAnalytics.id}';`,
  ]);
}
