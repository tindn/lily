export default function vendors(state = {}, action) {
  switch (action.type) {
    case 'UPDATE_VENDORS':
      return action.payload;
    case 'UPDATE_VENDOR':
      state[action.payload.id] = action.payload;
      return { ...state };
    case 'DELETE_VENDOR':
      delete state[action.payload];
      return { ...state };
    default:
      return state;
  }
}
