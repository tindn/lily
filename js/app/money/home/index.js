import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Card from '../../../components/card';
import MoneyDisplay from '../../../components/MoneyDisplay';
import Screen from '../../../components/screen';
import { getTransactionSummaryByCategory } from '../../../db/categories';
import { getAllFromTable } from '../../../db/shared';
import useToggle from '../../../hooks/useToggle';
import { loadCategoriesFromDbToRedux } from '../../../redux/actions/categories';
import { loadVendorsFromDbToRedux } from '../../../redux/actions/vendors';
import { useThemeColors } from '../../../uiKittenTheme';
import { getMonthStartEndFor } from '../../../utils/date';
import CategoryLine from './CategoryLine';
import TransactionForm from './TransactionForm';

var mapDispatchToProps = {
  loadVendorsFromDbToRedux: loadVendorsFromDbToRedux,
  loadCategoriesFromDbToRedux: loadCategoriesFromDbToRedux,
};

function Home(props) {
  var [lastThreeMonths, setLastThreeMonths] = useState([]);
  var [showSummaries, toggleSummaries] = useToggle();
  var [categorySummaries, setCategorySummaries] = useState([]);
  const themeColors = useThemeColors();
  var scrollViewRef = useRef(null);

  var updateData = useCallback(
    function() {
      const today = new Date();
      var [start, end] = getMonthStartEndFor(today);

      getTransactionSummaryByCategory(start.getTime(), end.getTime()).then(
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

  useFocusEffect(updateData);
  const currentMonth = lastThreeMonths[0];
  return (
    <Screen>
      {currentMonth ? (
        <TouchableOpacity
          onPress={toggleSummaries}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            marginTop: 15,
          }}
        >
          <MoneyDisplay
            amount={currentMonth.earned}
            style={{
              textAlign: 'left',
              fontWeight: '500',
              color: themeColors.textSuccessColor,
              fontSize: 16,
            }}
          />
          <MoneyDisplay
            amount={currentMonth.earned - currentMonth.spent}
            style={{
              textAlign: 'center',
              fontSize: 20,
            }}
            useParentheses
          />
          <MoneyDisplay
            amount={currentMonth.spent}
            style={{
              textAlign: 'right',
              color: themeColors.textDangerColor,
              fontSize: 16,
            }}
          />
        </TouchableOpacity>
      ) : null}
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShuldPersistTaps="always"
        ref={scrollViewRef}
      >
        {showSummaries ? (
          <Card style={{ marginVertical: 7 }}>
            {categorySummaries.map(function(category, index) {
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
          onTransactionAdded={updateData}
          style={{
            marginBottom: 235,
            marginTop: 20,
            marginHorizontal: 10,
            paddingHorizontal: 5,
          }}
        />
      </ScrollView>
    </Screen>
  );
}

export default connect(null, mapDispatchToProps)(Home);
