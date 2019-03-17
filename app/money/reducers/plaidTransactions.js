export default function plaidTransactions(state = {}, action) {
  switch (action.type) {
    case 'ADD_PLAID_TRANSACTIONS':
      return {
        ...state,
        [action.account]: action.transactions,
      };
    default:
      return state;
  }
}
