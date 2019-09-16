import { combineReducers } from 'redux';
import accounts from './accounts';
import currentMonthSetup from './currentMonthSetup';
import financeSnapshots from './financeSnapshots';
import monthlyAnalytics from './monthlyAnalytics';
import monthTransactions from './monthTransactions';
import vendors from './vendors';

export default combineReducers({
  monthTransactions,
  monthlyAnalytics,
  accounts,
  vendors,
  financeSnapshots,
  currentMonthSetup,
});
