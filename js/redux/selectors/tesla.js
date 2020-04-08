export function getAuthorization(state) {
  return state.tesla.authorization;
}

export function getVehicle(state) {
  return state.tesla.vehicle || {};
}

export function getIsRefreshingData(state) {
  return state.tesla.isRefreshingData;
}

export function getIsLocked(state) {
  if (!state.tesla.vehicle || !state.tesla.vehicle.vehicle_state) {
    return undefined;
  }
  return state.tesla.vehicle.vehicle_state.locked;
}
