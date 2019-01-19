export default function electricityReadings(state = [], action) {
  switch (action.type) {
    case 'UPDATE_ELECTRICITY_READINGS':
      return action.payload;
    default:
      return state;
  }
}
