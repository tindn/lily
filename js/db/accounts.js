import { getAllFromTable, getById } from './shared';

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
  return allEntries.reduce(function(acc, e) {
    if (e.entry_type == 'debit') {
      acc = acc - e.amount;
    } else {
      acc = acc + e.amount;
    }
    return acc;
  }, 0);
}
