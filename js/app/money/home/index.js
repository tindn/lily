import { useFocusEffect } from '@react-navigation/native';
import { Button } from 'components';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  LayoutAnimation,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Card from '../../../components/card';
import MoneyDisplay from '../../../components/MoneyDisplay';
import Screen from '../../../components/screen';
import { getTransactionSummaryByCategory } from '../../../db/categories';
import { getAllFromTable } from '../../../db/shared';
import { getLatestTransactions } from '../../../db/transactions';
import useToggle from '../../../hooks/useToggle';
import { loadCategoriesFromDbToRedux } from '../../../redux/actions/categories';
import { loadVendorsFromDbToRedux } from '../../../redux/actions/vendors';
import theme from '../../../theme';
import { getMonthStartEndFor } from '../../../utils/date';
import TransactionListItem from '../TransactionListItem';
import CategoryLine from './CategoryLine';
import TransactionForm from './TransactionForm';

var mapDispatchToProps = {
  loadVendorsFromDbToRedux: loadVendorsFromDbToRedux,
  loadCategoriesFromDbToRedux: loadCategoriesFromDbToRedux,
};

function Home(props) {
  var [currentMonth, setCurrentMonth] = useState([]);
  var [showSummaries, toggleSummaries] = useToggle();
  var [categorySummaries, setCategorySummaries] = useState([]);
  var scrollViewRef = useRef(null);
  var [latestTransactions, setLatestTransactions] = useState([]);

  var updateData = useCallback(function () {
    const today = new Date();
    var [start, end] = getMonthStartEndFor(today);

    getTransactionSummaryByCategory(start.getTime(), end.getTime()).then(
      setCategorySummaries
    );

    getAllFromTable(
      'monthly_analytics',
      ` WHERE end_date <= ${end.getTime()} ORDER BY start_date DESC LIMIT 1`
    ).then(res => {
      if (res && res.length) {
        setCurrentMonth(res[0]);
      }
    });

    getLatestTransactions(100).then(setLatestTransactions);
  }, []);

  // Will focus is not called on first load
  useEffect(function () {
    updateData();
    props.loadVendorsFromDbToRedux();
    props.loadCategoriesFromDbToRedux();
  }, []);

  useFocusEffect(updateData);
  return (
    <Screen>
      <ScrollView
        keyboardDismissMode='on-drag'
        keyboardShuldPersistTaps='always'
        ref={scrollViewRef}
      >
        {currentMonth ? (
          <TouchableOpacity
            onPress={() => {
              toggleSummaries();
              LayoutAnimation.easeInEaseOut();
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingTop: 20,
              marginBottom: 20,
            }}
          >
            <MoneyDisplay
              amount={currentMonth.earned}
              style={{
                textAlign: 'left',
                fontWeight: '500',
                fontSize: 16,
              }}
              type='credit'
            />
            <MoneyDisplay
              amount={currentMonth.spent}
              style={{
                textAlign: 'right',
                color: theme.colors.red,
                fontSize: 16,
              }}
              type='debit'
            />
            <MoneyDisplay
              amount={currentMonth.earned - currentMonth.spent}
              style={{
                textAlign: 'center',
                fontSize: 16,
              }}
              useParentheses
            />
          </TouchableOpacity>
        ) : null}
        {showSummaries ? (
          <Card style={{ marginTop: 10, marginHorizontal: 10 }}>
            {categorySummaries.map(function (category, index) {
              return (
                <CategoryLine
                  key={index.toString()}
                  category={category}
                  onPress={() => {
                    props.navigation.navigate('MonthTransactions', {
                      category: category.name,
                    });
                  }}
                />
              );
            })}
          </Card>
        ) : null}

        <TransactionForm
          getNearByVendors
          onTransactionAdded={updateData}
          style={{
            marginHorizontal: 10,
            paddingHorizontal: 10,
          }}
        />
        <ScrollView
          style={{
            marginHorizontal: 10,
            marginTop: 30,
            marginBottom: 10,
            height: 350,
          }}
        >
          {latestTransactions.map(item => (
            <TransactionListItem
              key={item.id}
              item={item}
              onPress={() => {
                props.navigation.navigate('TransactionDetails', {
                  title: item.memo,
                  transaction: item,
                });
              }}
            />
          ))}
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 10,
            marginHorizontal: 20,
          }}
        >
          <Button
            style={{ flex: 1, marginRight: 10 }}
            onPress={() => props.navigation.navigate('MonthlyAnalytics')}
          >
            Past Months
          </Button>
          <Button
            style={{ flex: 1, marginLeft: 10 }}
            onPress={() => props.navigation.navigate('FinanceOverview')}
          >
            Overview
          </Button>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 10,
            marginHorizontal: 20,
          }}
        >
          <Button
            style={{ flex: 1, marginRight: 10 }}
            onPress={() => props.navigation.navigate('Vendors')}
          >
            Vendors
          </Button>
          <Button
            style={{ flex: 1, marginLeft: 10 }}
            onPress={() => props.navigation.navigate('Categories')}
          >
            Categories
          </Button>
        </View>
      </ScrollView>
    </Screen>
  );
}

export default connect(null, mapDispatchToProps)(Home);
