export default function accounts(state = {}, action) {
  switch (action.type) {
    case 'UPDATE_ACCOUNTS':
      return action.payload;
    default:
      return state;
  }
}
