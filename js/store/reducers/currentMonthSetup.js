export default function currentMonthSetup(
  state = { earnings: [], fixedSpendings: [] },
  action
) {
  switch (action.type) {
    case 'UPDATE_MONTH_SETUP':
      return action.setup;
    default:
      return state;
  }
}
