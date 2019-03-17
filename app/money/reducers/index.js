import { combineReducers } from 'redux';
import monthTransactions from './monthTransactions';
import monthlyAnalytics from './monthlyAnalytics';
import accounts from './accounts';
import vendors from './vendors';
import plaidTransactions from './plaidTransactions';
import loadingPlaidTransactions from './loadingPlaidTransactions';

export default combineReducers({
  monthTransactions,
  monthlyAnalytics,
  accounts,
  vendors,
  plaidTransactions,
  loadingPlaidTransactions,
});
