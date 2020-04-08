export default function reducer(
  state = { isRefreshingData: false, vehicle: {} },
  action
) {
  switch (action.type) {
    case 'TESLA_REFRESH_DATA_START':
      return { ...state, isRefreshingData: true };
    case 'TESLA_REFRESH_DATA_SUCCESS':
      return {
        ...state,
        isRefreshingData: false,
        vehicle: { ...state.vehicle, ...action.data },
      };
    case 'TESLA_REFRESH_DATA_ERROR':
      return { ...state, isRefreshingData: false };
    case 'TESLA_LOGIN_SUCCESS':
      return { ...state, authorization: action.data };
    default:
      return state;
  }
}
