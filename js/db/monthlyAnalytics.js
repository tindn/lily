import { endOfYear, startOfYear } from 'date-fns';
import { db, queryResultToArray } from './shared';
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

export async function calculateSummaryForCurrentYear() {
  const yearStart = startOfYear(new Date()).getTime();
  const yearEnd = endOfYear(new Date()).getTime();
  const analyticsForYear = await db
    .executeSql(
      `
  SELECT * FROM monthly_analytics
  WHERE
    start_date >= ${yearStart} AND end_date <= ${yearEnd}
  ORDER BY
    end_date ASC;
`
    )
    .then(queryResultToArray);
  const totals = analyticsForYear.reduce(
    (summary, monthly) => {
      summary.totalSpent += monthly.spent;
      summary.totalEarned += monthly.earned;
      summary.totalSaved += monthly.earned - monthly.spent;
      return summary;
    },
    {
      totalSpent: 0,
      totalEarned: 0,
      totalSaved: 0,
    }
  );
  return {
    ...totals,
    averageSpent: totals.totalSpent / analyticsForYear.length,
    averageEarned: totals.totalEarned / analyticsForYear.length,
    averageSaved: totals.totalSaved / analyticsForYear.length,
  };
}
