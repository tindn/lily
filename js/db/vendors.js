import uuid from 'uuid/v1';
import { db, getAllFromTable } from './shared';

export async function getAllVendors() {
  var vendors = await getAllFromTable('vendors');
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
    if (coordinatesByVendor[vendor.id] != undefined) {
      vendor.locations = coordinatesByVendor[vendor.id];
    }
  });
  return vendors;
}

export function addVendor(vendor) {
  var scripts = [];
  var vendorId = uuid();
  scripts.push(
    `INSERT INTO vendors 
     (id, name, updated_on_utc)
     VALUES ('${vendorId}','${escape(vendor.name)}',datetime());`
  );

  if (vendor.locations && vendor.locations.length) {
    vendor.locations.forEach(function(location) {
      var locationId = uuid();
      scripts.push(
        `INSERT INTO coordinates (id, latitude, longitude, vendor_id) 
         VALUES ('${locationId}',${location.latitude},${location.longitude},'${vendorId}');`
      );
    });
  }
  return db.sqlBatch(scripts);
}

export async function saveVendor(vendor) {
  var scripts = [];
  scripts.push(
    `UPDATE vendors 
     SET name = '${escape(vendor.name)}', updated_on_utc = datetime() 
     WHERE id = '${vendor.id}';`
  );

  if (vendor.locations && vendor.locations.length) {
    vendor.locations.forEach(function(location) {
      if (location.id) {
        scripts.push(
          `UPDATE coordinates 
           SET latitude = ${location.latitude}, longitude = ${location.longitude} 
           WHERE id = '${location.id}';`
        );
      } else {
        var locationId = uuid();
        scripts.push(
          `INSERT INTO coordinates (id, latitude, longitude, vendor_id) 
           VALUES ('${locationId}',${location.latitude},${location.longitude},'${vendor.id}');`
        );
      }
    });
  } else {
    var existingLocations = await getAllFromTable(
      'coordinates',
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
    `DELETE FROM coordinates WHERE vendor_id = '${id}';`,
    `DELETE FROM vendors WHERE id = '${id}';`,
  ];

  return db.sqlBatch(scripts);
}
