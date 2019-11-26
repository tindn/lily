import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { toWeekDayDateStringFromTimestamp } from '../../../utils/date';
import { calculateFinanceOverview } from '../../../utils/money';
import MoneyDisplay from '../../components/moneyDisplay';
import Screen from '../../components/screen';
import { getAccountSnapshots } from '../../db/accountSnapshots';
import theme from '../../theme';

function SnapshotList() {
  var [list, setList] = useState([]);
  var getData = useCallback(
    function() {
      getAccountSnapshots()
        .then(function(accountSnapshots) {
          var snapshots = accountSnapshots.reduce(function(
            acc,
            accountSnapshot
          ) {
            if (!acc[accountSnapshot.date_time]) {
              acc[accountSnapshot.date_time] = [];
            }
            acc[accountSnapshot.date_time].push(accountSnapshot);
            return acc;
          },
          {});
          return Object.entries(snapshots).map(function(snap) {
            var overview = calculateFinanceOverview(snap[1]);
            overview.date_time = snap[0];
            return overview;
          });
        })
        .then(setList);
    },
    [setList]
  );
  return (
    <Screen>
      <NavigationEvents onWillFocus={getData} />
      <FlatList
        data={list}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <View style={styles.emptyComponent}>
            <Text>No snapshots found.</Text>
          </View>
        }
        renderItem={({ item }) => {
          return (
            <View style={styles.listItem}>
              <View style={{ alignSelf: 'flex-start', marginBottom: 15 }}>
                <Text>
                  {toWeekDayDateStringFromTimestamp(parseInt(item.date_time))}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <MoneyDisplay amount={item.liquidity} />
                <MoneyDisplay amount={item.networth} />
              </View>
            </View>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyComponent: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  listItem: {
    backgroundColor: theme.colors.backgroundColor,
    borderBottomColor: theme.colors.lighterGray,
    borderBottomWidth: 1,
    flex: 1,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
  },
});

export default SnapshotList;
