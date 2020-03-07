import { getAllFromTable, db, queryResultToArray } from './shared';

export function getActiveCategories() {
  return getAllFromTable('categories', 'WHERE is_archived = false').then(
    function(categories) {
      categories.forEach(function(c) {
        c.name = unescape(c.name);
      });
      return categories;
    }
  );
}

export function getAllCategories() {
  return getAllFromTable('categories').then(function(categories) {
    categories.forEach(function(c) {
      c.name = unescape(c.name);
    });
    return categories;
  });
}

export function archiveCategory(name) {
  return db.executeSql(
    `UPDATE categories SET is_archived = 1 WHERE name = '${escape(name)}';`
  );
}

export function unarchiveCategory(name) {
  return db.executeSql(
    `UPDATE categories SET is_archived = 0 WHERE name = '${escape(name)}';`
  );
}

export function createCategory(name) {
  return db.executeSql(
    `INSERT INTO categories VALUES ('${escape(name)}', false);`
  );
}

export function editCategory(oldName, newName) {
  return db.executeSql(
    `UPDATE categories SET name = '${escape(newName)}' WHERE name = '${escape(
      oldName
    )}'`
  );
}

export function getTransactionSummaryByCategory(from, to) {
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

export function getTransactionSumForCategory(category, entry_type, from, to) {
  return db
    .executeSql(
      `
    SELECT
      sum(amount) as amount
    FROM
      transactions
    WHERE
      category = '${escape(
        category
      )}' AND entry_type = '${entry_type}' AND date_time >= ${from} AND date_time < ${to}
    GROUP BY
      category, entry_type
     ORDER BY entry_type ASC, sum(amount) DESC;`
    )
    .then(queryResultToArray)
    .then(rows => {
      if (rows && rows.length) {
        return rows[0].amount;
      } else {
        return 0;
      }
    });
}
