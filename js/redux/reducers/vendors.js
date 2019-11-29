export default function vendors(state = {}, action) {
  switch (action.type) {
    case 'UPDATE_VENDORS':
      return action.payload;
    default:
      return state;
  }
}
