import React, { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import Swipeable from 'react-native-swipeable-row';
import { NavigationEvents } from 'react-navigation';
import MoneyDisplay from '../../../components/moneyDisplay';
import Screen from '../../../components/screen';
import SwipeToDeleteContent from '../../../components/Swipeable/SwipeToDeleteContent';
import {
  deleteAccountSnapshot,
  getAccountSnapshots,
} from '../../../db/accountSnapshots';
import { error, success } from '../../../log';
import theme from '../../../theme';
import { toWeekDayDateStringFromTimestamp } from '../../../utils/date';
import { calculateFinanceOverview } from '../../../utils/money';

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
            <Swipeable
              rightActionActivationDistance={175}
              onRightActionRelease={function() {
                Alert.alert('Confirm', 'Do you want to delete this snapshot?', [
                  {
                    text: 'Cancel',
                  },
                  {
                    text: 'Delete',
                    onPress: function() {
                      deleteAccountSnapshot(item.date_time)
                        .then(function() {
                          getData();
                          success('Snapshot removed');
                        })
                        .catch(function(e) {
                          error('Failed to remove snapshot', e);
                        });
                    },
                    style: 'destructive',
                  },
                ]);
              }}
              rightContent={<SwipeToDeleteContent />}
            >
              <View style={styles.listItem}>
                <Text style={{ fontWeight: '500' }}>
                  {toWeekDayDateStringFromTimestamp(parseInt(item.date_time))}
                </Text>
                <MoneyDisplay amount={item.liquidity} />
                <MoneyDisplay amount={item.networth} />
              </View>
            </Swipeable>
          );
        }}
      />
    </Screen>
  );
}

SnapshotList.navigationOptions = {
  headerTitle: 'Snapshots',
};

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
});

export default SnapshotList;
