import { combineReducers } from 'redux';
import monthTransactions from './monthTransactions';
import monthlyAnalytics from './monthlyAnalytics';
import accounts from './accounts';

export default combineReducers({
  monthTransactions,
  monthlyAnalytics,
  accounts,
});
