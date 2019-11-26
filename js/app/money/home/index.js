import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Card from '../../../components/card';
import Screen from '../../../components/screen';
import { getAllFromTable } from '../../../db/shared';
import theme from '../../../theme';
import MonthlyAnalyticsOverview from './monthlyAnalyticsOverview';
import SpendTracking from './spendTracking';
import TransactionAdd from './transactionAdd';
import TransactionForm from './transactionForm';

function Home(props) {
  var [spendingThisMonth, setSpendingThisMonth] = useState(0);
  var [earningThisMonth, setEarningThisMonth] = useState(0);
  var [variableSpendingThisMonth, setVariableSpendingThisMonth] = useState(0);
  var [showTransactionForm, setShowTransactionForm] = useState(false);
  var [lastThreeMonths, setLastThreeMonths] = useState([]);
  var scrollViewRef = useRef(null);

  var updateData = useCallback(
    function() {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      getAllFromTable(
        'transactions',
        ` WHERE date_time > ${startOfMonth.getTime()} ORDER BY date_time DESC `
      ).then(data => {
        var summary = data.reduce(
          function(acc, t) {
            if (t.entry_type == 'debit') {
              acc.spent = acc.spent + t.amount;
              if (t.is_discretionary) {
                acc.variableSpent = acc.variableSpent + t.amount;
              }
              return acc;
            }

            if (t.entry_type == 'credit') {
              acc.earned = acc.earned + t.amount;
              return acc;
            }
            return acc;
          },
          { spent: 0, earned: 0, variableSpent: 0 }
        );
        setSpendingThisMonth(summary.spent);
        setEarningThisMonth(summary.earned);
        setVariableSpendingThisMonth(summary.variableSpent);
      });

      var fourthMonthsAgo = new Date(Date.now() - 3600000 * 24 * 120).getTime();
      getAllFromTable(
        'monthly_analytics',
        ` WHERE start_date > ${fourthMonthsAgo} AND end_date < ${today.getTime()} ORDER BY start_date DESC `
      ).then(setLastThreeMonths);
    },
    [
      setSpendingThisMonth,
      setEarningThisMonth,
      setVariableSpendingThisMonth,
      setLastThreeMonths,
    ]
  );

  // Will focus is not called on first load
  useEffect(function() {
    updateData();
  }, []);

  return (
    <Screen>
      <NavigationEvents onWillFocus={updateData} />
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShuldPersistTaps="always"
        ref={scrollViewRef}
      >
        <Card
          onPress={() => {
            props.navigation.navigate('MonthTransactions');
          }}
          style={{ marginTop: 10, padding: 15 }}
        >
          <SpendTracking
            earningThisMonth={earningThisMonth}
            spendingThisMonth={spendingThisMonth}
            variableSpendingThisMonth={variableSpendingThisMonth}
            navigation={props.navigation}
          />
        </Card>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 15,
            justifyContent: 'space-around',
          }}
        >
          {lastThreeMonths.length
            ? lastThreeMonths.map(month => (
                <Card
                  key={month.id}
                  onPress={() => {
                    props.navigation.navigate('MonthlyAnalytics');
                  }}
                  style={{ paddingHorizontal: 15 }}
                >
                  <MonthlyAnalyticsOverview month={month} />
                </Card>
              ))
            : null}
        </View>
        <Card
          style={{
            paddingVertical: 15,
            marginTop: 15,
            alignItems: 'center',
          }}
          onPress={() => props.navigation.navigate('Vendors')}
        >
          <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>
            Vendors
          </Text>
        </Card>
        <Card
          style={{
            paddingVertical: 15,
            marginTop: 15,
            alignItems: 'center',
          }}
          onPress={() => props.navigation.navigate('FinanceOverview')}
        >
          <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>
            Overview
          </Text>
        </Card>

        {showTransactionForm ? (
          <TransactionForm
            collapse={() => {
              setShowTransactionForm(false);
            }}
            onTransactionAdded={updateData}
            style={{ marginBottom: 200, marginTop: 20 }}
          />
        ) : null}
      </ScrollView>
      {!showTransactionForm ? (
        <TransactionAdd
          onPress={() => {
            setShowTransactionForm(true);
            // eslint-disable-next-line no-undef
            setTimeout(() => {
              scrollViewRef.current.scrollToEnd({ animated: true });
            }, 100);
          }}
        />
      ) : null}
    </Screen>
  );
}
Home.navigationOptions = {
  header: null,
};

export default Home;
