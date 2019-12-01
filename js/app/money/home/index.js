import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import Card from '../../../components/card';
import MoneyDisplay from '../../../components/moneyDisplay';
import Screen from '../../../components/screen';
import { getAllFromTable } from '../../../db/shared';
import { getCategorySummary } from '../../../db/transactions';
import useToggle from '../../../hooks/useToggle';
import { loadCategoriesFromDbToRedux } from '../../../redux/actions/categories';
import { loadVendorsFromDbToRedux } from '../../../redux/actions/vendors';
import sharedStyles from '../../../sharedStyles';
import theme from '../../../theme';
import { getMonthStartEndFor } from '../../../utils/date';
import MonthlyAnalyticsOverview from './monthlyAnalyticsOverview';
import TransactionAdd from './transactionAdd';
import TransactionForm from './transactionForm';

var mapDispatchToProps = {
  loadVendorsFromDbToRedux: loadVendorsFromDbToRedux,
  loadCategoriesFromDbToRedux: loadCategoriesFromDbToRedux,
};

function Home(props) {
  var [showTransactionForm, setShowTransactionForm] = useState(false);
  var [lastThreeMonths, setLastThreeMonths] = useState([]);
  var [showSummaries, toggleSummaries] = useToggle();
  var [categorySummaries, setCategorySummaries] = useState([]);

  var scrollViewRef = useRef(null);

  var updateData = useCallback(
    function() {
      const today = new Date();
      var [start, end] = getMonthStartEndFor(today);

      getCategorySummary(start.getTime(), end.getTime()).then(
        setCategorySummaries
      );

      getAllFromTable(
        'monthly_analytics',
        ` WHERE end_date <= ${end.getTime()} ORDER BY start_date DESC LIMIT 3`
      ).then(setLastThreeMonths);
    },
    [setLastThreeMonths]
  );

  // Will focus is not called on first load
  useEffect(function() {
    updateData();
    props.loadVendorsFromDbToRedux();
    props.loadCategoriesFromDbToRedux();
  }, []);

  return (
    <Screen>
      <NavigationEvents onWillFocus={updateData} />
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShuldPersistTaps="always"
        ref={scrollViewRef}
      >
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 7,
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
        {showSummaries ? (
          <Card onPress={toggleSummaries} style={{ marginVertical: 7 }}>
            {categorySummaries.map(function(category, index) {
              return (
                <View
                  key={index.toString()}
                  style={[
                    {
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: 5,
                    },
                    sharedStyles.borderBottom,
                  ]}
                >
                  <Text style={{ fontSize: 16 }}>{category.name}</Text>
                  <MoneyDisplay
                    amount={category.amount}
                    useParentheses={false}
                    style={[
                      { fontSize: 16 },
                      category.entry_type == 'debit' && {
                        color: theme.colors.red,
                      },
                    ]}
                  />
                </View>
              );
            })}
          </Card>
        ) : (
          <Card
            style={{
              paddingVertical: 15,
              marginVertical: 7,
              alignItems: 'center',
            }}
            onPress={toggleSummaries}
          >
            <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>
              Summary
            </Text>
          </Card>
        )}
        <Card
          style={{
            paddingVertical: 15,
            marginVertical: 7,
            alignItems: 'center',
          }}
          onPress={() => {
            props.navigation.navigate('MonthTransactions', {
              date: new Date(),
            });
          }}
        >
          <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>
            Transactions
          </Text>
        </Card>
        <Card
          style={{
            paddingVertical: 15,
            marginVertical: 7,
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
            marginVertical: 7,
            alignItems: 'center',
          }}
          onPress={() => props.navigation.navigate('Categories')}
        >
          <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>
            Categories
          </Text>
        </Card>
        <Card
          style={{
            paddingVertical: 15,
            marginVertical: 7,
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
            style={{ marginBottom: 235, marginTop: 20 }}
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

export default connect(null, mapDispatchToProps)(Home);
