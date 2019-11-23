export default [
  [
    `
    CREATE TABLE vendors (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      updated_on_utc TEXT NOT NULL
    );
    `,
    `
    CREATE TABLE coordinates (
      id TEXT PRIMARY KEY NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      vendor_id TEXT NOT NULL,
      FOREIGN KEY(vendor_id) REFERENCES vendors(id)
    );
    `,
  ],
];
