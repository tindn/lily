import { getAllVendors } from '../../db';
import { reduceToMapById } from '../../utils/reduceToMap';
import {
  addVendor,
  saveVendor,
  getVendorById,
  deleteVendor,
} from '../../db/vendors';

export function loadVendorsFromDbToRedux() {
  return function(dispatch) {
    getAllVendors()
      .then(reduceToMapById)
      .then(function(vendors) {
        dispatch({ type: 'UPDATE_VENDORS', payload: vendors });
      });
  };
}

export function addVendorToDb(vendor) {
  return function(dispatch) {
    return addVendor(vendor).then(function() {
      return dispatch(loadVendorsFromDbToRedux());
    });
  };
}

export function saveVendorToDb(vendor) {
  return function(dispatch) {
    return saveVendor(vendor)
      .then(function() {
        return getVendorById(vendor.id);
      })
      .then(function(updatedVendor) {
        return dispatch({ type: 'UPDATE_VENDOR', payload: updatedVendor });
      });
  };
}

export function deleteVendorFromDb(id) {
  return function(dispatch) {
    return deleteVendor(id).then(function() {
      return dispatch({ type: 'DELETE_VENDOR', payload: id });
    });
  };
}
