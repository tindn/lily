import { TESLA_CLIENT_ID, TESLA_CLIENT_SECRET } from 'react-native-dotenv';
import request from '../../utils/request';
import { getAuthorization, getVehicle } from '../selectors/tesla';

function stateToAuthorizationHeaders(state) {
  return {
    Authorization: stateToAuthorization(state),
  };
}

function stateToAuthorization(state) {
  var authorization = getAuthorization(state);
  return 'Bearer ' + authorization.access_token;
}

export function wake() {
  return async function(dispatch, getState) {
    var state = getState();
    await wakeApi(state);
    await sleep(12000);
    dispatch(refreshData());
  };
}

function wakeApi(state) {
  var vehicle = getVehicle(state);
  return request(
    `https://owner-api.teslamotors.com/api/1/vehicles/${vehicle.id_s}/wake_up`,
    {
      method: 'POST',
      headers: stateToAuthorizationHeaders(state),
    }
  );
}

export function login(email, password) {
  return async function(dispatch) {
    return request('https://owner-api.teslamotors.com/oauth/token', {
      method: 'POST',
      body: JSON.stringify({
        grant_type: 'password',
        password: password,
        email: email,
        client_id: TESLA_CLIENT_ID,
        client_secret: TESLA_CLIENT_SECRET,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      dispatch({ type: 'TESLA_LOGIN_SUCCESS', data: response });
    });
  };
}

export function refreshData() {
  return async function(dispatch, getState) {
    var state = getState();
    var authorization = getAuthorization(state);
    if (!authorization) {
      return;
    }
    try {
      dispatch({ type: 'TESLA_REFRESH_DATA_START' });
      var vehicle = await getVehiclesApi(state);
      if (vehicle.state == 'online') {
        var detailedData = await getVehicleDataApi(state, vehicle.id_s);
        vehicle = { ...vehicle, ...detailedData };
      }
      dispatch({ type: 'TESLA_REFRESH_DATA_SUCCESS', data: vehicle });
    } catch {
      dispatch({ type: 'TESLA_REFRESH_DATA_ERROR' });
    }
  };
}

export function getVehicleData() {
  return async function(dispatch, getState) {
    var state = getState();
    var authorization = getAuthorization(state);
    var vehicle = getVehicle(state);
    if (!authorization) {
      return;
    }
    try {
      dispatch({ type: 'TESLA_REFRESH_DATA_START' });
      var detailedData = await getVehicleDataApi(state, vehicle.id_s);
      dispatch({ type: 'TESLA_REFRESH_DATA_SUCCESS', data: detailedData });
    } catch {
      dispatch({ type: 'TESLA_REFRESH_DATA_ERROR' });
    }
  };
}

function getVehiclesApi(state) {
  return request('https://owner-api.teslamotors.com/api/1/vehicles', {
    headers: stateToAuthorizationHeaders(state),
  }).then(data => {
    var vehicle = data.response[0];
    vehicle.state_timestamp = Date.now();
    return vehicle;
  });
}

function getVehicleDataApi(state, vehicle_id) {
  return request(
    'https://owner-api.teslamotors.com/api/1/vehicles/' +
      vehicle_id +
      '/vehicle_data',
    {
      headers: stateToAuthorizationHeaders(state),
    }
  )
    .then(response => {
      response = response.response;
      var isLocked = false,
        isFrunkOpen = false,
        isTrunkOpen = false,
        physicalStateTimestamp;
      if (response.vehicle_state) {
        isLocked = response.vehicle_state.locked;
        isFrunkOpen = !!response.vehicle_state.ft; // ft != 0 means open
        isTrunkOpen = !!response.vehicle_state.rt; //rt != 0 means open
        physicalStateTimestamp = response.vehicle_state.timestamp;
      }
      var batteryLevel = 0,
        ratedRange = 0,
        chargeLimit = 50,
        chargingState = 'Disconnected',
        chargeStateTimestamp,
        minutesToFullCharge = 0,
        chargeAdded = 0,
        chargeRate = 0,
        chargeCurrent = 0,
        chargeVoltage = 0,
        chargePower = 0;
      if (response.charge_state) {
        batteryLevel = response.charge_state.battery_level;
        ratedRange = response.charge_state.battery_range;
        chargeLimit = response.charge_state.charge_limit_soc;
        chargingState = response.charge_state.charging_state;
        chargeStateTimestamp = response.charge_state.timestamp;
        minutesToFullCharge = response.charge_state.minutes_to_full_charge;
        chargeAdded = response.charge_state.charge_energy_added;
        chargeRate = response.charge_state.charge_rate;
        chargeCurrent = response.charge_state.charger_actual_current;
        chargeVoltage = response.charge_state.charger_voltage;
        chargePower = (chargeCurrent * chargeVoltage).toFixed(0);
      }
      return {
        isLocked,
        isFrunkOpen,
        isTrunkOpen,
        physicalStateTimestamp,
        batteryLevel,
        ratedRange,
        chargeLimit,
        chargingState,
        chargeStateTimestamp,
        minutesToFullCharge,
        chargeAdded,
        chargeRate,
        chargeCurrent,
        chargeVoltage,
        chargePower,
      };
    })
    .catch(err => {
      // if car is asleep, called failed with status code 408
      return {};
    });
}

export function openFrunk() {
  return async function(dispatch, getState) {
    var state = getState();
    var vehicle = getVehicle(state);
    if (vehicle.state === 'asleep' || vehicle.state === 'offline') {
      await wakeApi(state);
      await sleep(12000);
    }
    var formData = new FormData();
    formData.append('which_trunk', 'front');
    return request(
      `https://owner-api.teslamotors.com/api/1/vehicles/${vehicle.id_s}/command/actuate_trunk`,
      {
        method: 'POST',
        headers: stateToAuthorizationHeaders(state),
        body: formData,
      }
    ).then(function() {
      dispatch(refreshData());
    });
  };
}

export function lock() {
  return async function(dispatch, getState) {
    var state = getState();
    var vehicle = getVehicle(state);
    await request(
      `https://owner-api.teslamotors.com/api/1/vehicles/${vehicle.id_s}/command/door_lock`,
      {
        method: 'POST',
        headers: stateToAuthorizationHeaders(state),
      }
    );
    await sleep(2000);
    dispatch(refreshData());
  };
}

export function unlock() {
  return async function(dispatch, getState) {
    var state = getState();
    var vehicle = getVehicle(state);
    if (vehicle.state === 'asleep' || vehicle.state === 'offline') {
      await wakeApi(state);
      await sleep(12000);
    }
    await request(
      `https://owner-api.teslamotors.com/api/1/vehicles/${vehicle.id_s}/command/door_unlock`,
      {
        method: 'POST',
        headers: stateToAuthorizationHeaders(state),
      }
    );
    await sleep(1000);
    dispatch(refreshData());
  };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function setChargeLimit(limit) {
  return async function(dispatch, getState) {
    var state = getState();
    var vehicle = getVehicle(state);
    if (vehicle.state === 'asleep' || vehicle.state === 'offline') {
      return;
    }
    var formData = new FormData();
    formData.append('percent', limit);
    await request(
      `https://owner-api.teslamotors.com/api/1/vehicles/${vehicle.id_s}/command/set_charge_limit`,
      {
        method: 'POST',
        headers: stateToAuthorizationHeaders(state),
        body: formData,
      }
    );
    dispatch(getVehicleData());
  };
}
