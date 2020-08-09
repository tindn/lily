import { combineReducers } from 'redux';
import accounts from './accounts';
import categories from './categories';
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
  categories,
});
