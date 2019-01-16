export default function reducer(state = [], action) {
  switch (action.type) {
    case 'UPDATE_MONTH_TRANSACTIONS':
      return action.transactions;
    default:
      return state;
  }
}
