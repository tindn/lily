export default function loadingPlaidTransactions(state = false, action) {
  switch (action.type) {
    case 'FETCH_PLAID_TRANSACTIONS_STARTED':
      return true;
    case 'FETCH_PLAID_TRANSACTIONS_FAILED':
    case 'FETCH_PLAID_TRANSACTIONS_COMPLETED':
      return false;
    default:
      return state;
  }
}
