import uuid from 'uuid/v1';
import { db, getAllFromTable, queryResultToArray } from './shared';

export async function getAllVendors() {
  var vendors = await getAllFromTable('vendors', 'ORDER BY name');
  var coordinates = await getAllFromTable('vendor_coordinates');
  var coordinatesByVendor = coordinates.reduce(function(acc, coord) {
    if (acc[coord.vendor_id] != undefined) {
      acc[coord.vendor_id].push(coord);
    } else {
      acc[coord.vendor_id] = [coord];
    }
    return acc;
  }, {});
  vendors.forEach(function(vendor) {
    vendor.name = unescape(vendor.name);
    if (vendor.category) {
      vendor.category = unescape(vendor.category);
    }
    if (coordinatesByVendor[vendor.id] != undefined) {
      vendor.locations = coordinatesByVendor[vendor.id];
    }
  });
  return vendors;
}

export async function getNearbyVendors({ latitude, longitude }) {
  latitude = latitude.toFixed(3).toString();
  latitude = latitude.substring(0, latitude.length - 1);
  longitude = longitude.toFixed(3).toString();
  longitude = longitude.substring(0, longitude.length - 1);

  var vendors = await db
    .executeSql(
      `
      SELECT
        v.*,
        c.latitude,
        c.longitude
      FROM
        vendors v
      LEFT JOIN vendor_coordinates c ON v.id = c.vendor_id
      WHERE
        c.latitude LIKE '${latitude}%'
        AND c.longitude LIKE '${longitude}%';`
    )
    .then(queryResultToArray);
  vendors.forEach(v => (v.name = unescape(v.name)));
  return vendors;
}

export async function getVendorById(id) {
  var rows = await db
    .executeSql(
      `
  SELECT
    v.id as id,
    name,
    updated_on,
    c.id as location_id,
    latitude,
    longitude,
    v.category
  FROM
    vendors v
    LEFT JOIN vendor_coordinates c ON v.id = c.vendor_id
  WHERE
    v.id = '${id}';`
    )
    .then(queryResultToArray);
  if (!rows || !rows.length) {
    return null;
  }
  return {
    id: rows[0].id,
    name: unescape(rows[0].name),
    category: unescape(rows[0].category),
    updated_on: rows[0].updated_on,
    locations: rows
      .filter(r => r.location_id)
      .map(r => ({
        id: r.location_id,
        latitude: r.latitude,
        longitude: r.longitude,
      })),
  };
}

export function addVendor(vendor) {
  var scripts = [];
  var vendorId = uuid();
  var category = 'NULL';
  if (vendor.category) {
    category = `'${escape(vendor.category)}'`;
  }
  scripts.push(
    `INSERT INTO vendors
     VALUES ('${vendorId}','${escape(
      vendor.name
    )}', ${Date.now()}, 0, ${category});`
  );

  if (vendor.locations && vendor.locations.length) {
    vendor.locations.forEach(function(location) {
      var locationId = uuid();
      scripts.push(
        `INSERT INTO vendor_coordinates (id, latitude, longitude, vendor_id) 
         VALUES ('${locationId}',${location.latitude},${location.longitude},'${vendorId}');`
      );
    });
  }
  return db.sqlBatch(scripts).then(function() {
    return vendorId;
  });
}

export async function saveVendor(vendor) {
  var scripts = [];
  scripts.push(
    `UPDATE vendors 
     SET name = '${escape(
       vendor.name
     )}', updated_on = ${Date.now()}, category = '${escape(vendor.category)}'
     WHERE id = '${vendor.id}';`
  );

  if (vendor.locations && vendor.locations.length) {
    vendor.locations.forEach(function(location) {
      if (location.id) {
        scripts.push(
          `UPDATE vendor_coordinates 
           SET latitude = ${location.latitude}, longitude = ${location.longitude} 
           WHERE id = '${location.id}';`
        );
      } else {
        var locationId = uuid();
        scripts.push(
          `INSERT INTO vendor_coordinates (id, latitude, longitude, vendor_id) 
           VALUES ('${locationId}',${location.latitude},${location.longitude},'${vendor.id}');`
        );
      }
    });
  } else {
    var existingLocations = await getAllFromTable(
      'vendor_coordinates',
      `WHERE vendor_id = '${vendor.id}'`
    );
    if (existingLocations && existingLocations.length) {
      existingLocations.forEach(function(l) {
        scripts.push(`DELETE FROM coordinates WHERE id = '${l.id}';`);
      });
    }
  }
  return db.sqlBatch(scripts);
}

export function deleteVendor(id) {
  var scripts = [
    `DELETE FROM vendor_coordinates WHERE vendor_id = '${id}';`,
    `DELETE FROM vendors WHERE id = '${id}';`,
  ];

  return db.sqlBatch(scripts);
}
