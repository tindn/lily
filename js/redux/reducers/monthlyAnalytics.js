export default function reducer(state = {}, action) {
  switch (action.type) {
    case 'UPDATE_MONTHLY_ANALYTICS':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
