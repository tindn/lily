export default function Vendors(state = [], action) {
  switch (action.type) {
    case 'UPDATE_VENDORS':
      return action.payload.sort();
    default:
      return state;
  }
}
