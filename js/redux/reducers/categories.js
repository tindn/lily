export default function categories(state = [], action) {
  switch (action.type) {
    case 'UPDATE_CATEGORIES':
      return action.payload;
    default:
      return state;
  }
}
