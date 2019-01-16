import { combineReducers } from 'redux';
import monthTransactions from './monthTransactions';
import monthlyAnalytics from './monthlyAnalytics';

export default combineReducers({
  monthTransactions,
  monthlyAnalytics,
});
