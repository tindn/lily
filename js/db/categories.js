import { getAllFromTable, db } from './shared';

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
