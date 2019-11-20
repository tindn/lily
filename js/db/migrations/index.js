export default [
  `
  CREATE TABLE vendors (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    updated_on_utc TEXT NOT NULL
  );
  
  CREATE TABLE coordinates (
    id INTEGER PRIMARY KEY NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    decimal_places INTEGER,
    vendor_id INTEGER NOT NULL,
    FOREIGN KEY(vendor_id) REFERENCES vendors(id)
  );
  `,
];
