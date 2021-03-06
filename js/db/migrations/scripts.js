export default [
  [
    `
    CREATE TABLE vendors (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      updated_on INTEGER NOT NULL
    );
    `,
    `
    CREATE TABLE vendor_coordinates (
      id TEXT PRIMARY KEY NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      vendor_id TEXT NOT NULL,
      FOREIGN KEY(vendor_id) REFERENCES vendors(id)
    );
    `,
    `
    CREATE TABLE transactions (
      id TEXT PRIMARY KEY NOT NULL,
      entry_type TEXT NOT NULL,
      amount REAL NOT NULL,
      date_time INTEGER NOT NULL,
      added_on INTEGER NOT NULL,
      updated_on INTERGER,
      location TEXT,
      memo TEXT,
      vendor_id TEXT,
      is_discretionary INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY(vendor_id) REFERENCES vendors(id)
    );
    `,
  ],
  [
    `
    CREATE TABLE monthly_analytics (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      start_date INTEGER NOT NULL,
      end_date INTEGER NOT NULL,
      earned REAL NOT NULL,
      spent REAL NOT NULL
    );
    `,
  ],
  [
    `
    CREATE TABLE accounts (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      balance REAL NOT NULL,
      updated_on INTEGER NOT NULL
    );
    `,
    `
    CREATE TABLE account_entries (
      id TEXT PRIMARY KEY NOT NULL,
      amount REAL NOT NULL,
      memo TEXT,
      entry_type TEXT NOT NULL,
      date_time INTEGER NOT NULL,
      added_on INTEGER NOT NULL,
      updated_on INTERGER,
      account_id TEXT NOT NULL,
      FOREIGN KEY(account_id) REFERENCES accounts(id)
    );
    `,
    `
    CREATE TABLE account_snapshots (
      id TEXT PRIMARY KEY NOT NULL,
      balance REAL NOT NULL,
      date_time INTEGER NOT NULL,
      account_id TEXT NOT NULL,
      FOREIGN KEY(account_id) REFERENCES accounts(id)
    );
    `,
  ],
  [
    `
    ALTER TABLE accounts ADD COLUMN is_archived INTEGER NOT NULL DEFAULT 0;
    `,
    `
    ALTER TABLE vendors ADD COLUMN is_archived INTEGER NOT NULL DEFAULT 0;
    `,
  ],
  [
    `
    CREATE TABLE transactions_new (
      id TEXT PRIMARY KEY NOT NULL,
      entry_type TEXT NOT NULL,
      amount REAL NOT NULL,
      date_time INTEGER NOT NULL,
      added_on INTEGER NOT NULL,
      updated_on INTERGER,
      location TEXT,
      memo TEXT,
      vendor_id TEXT,
      category TEXT,
      FOREIGN KEY(vendor_id) REFERENCES vendors(id)
    );`,
    `
    INSERT INTO transactions_new 
    SELECT id, entry_type, amount, date_time, added_on, updated_on, location, memo, vendor_id, NULL
    FROM transactions;
    `,
    `
    DROP TABLE transactions;`,
    `
    ALTER TABLE transactions_new RENAME TO transactions;`,
    `
    ALTER TABLE vendors ADD COLUMN category TEXT;`,
    `
    CREATE TABLE categories (
      name TEXT PRIMARY KEY NOT NULL,
      is_archived INTEGER NOT NULL DEFAULT 0
    );`,
  ],
];
