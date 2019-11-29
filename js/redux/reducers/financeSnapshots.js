export default function financeSnapshots(state = [], action) {
  switch (action.type) {
    case 'UPDATE_FINANCE_SNAPSHOTS':
      return action.payload;
    default:
      return state;
  }
}
