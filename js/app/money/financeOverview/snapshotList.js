import { useFocusEffect } from '@react-navigation/native';
import { ListItem } from '@ui-kitten/components';
import { Text } from 'components';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import Swipeable from 'react-native-swipeable-row';
import MoneyDisplay from '../../../components/MoneyDisplay';
import Screen from '../../../components/screen';
import SwipeToDeleteContent from '../../../components/Swipeable/SwipeToDeleteContent';
import {
  deleteAccountSnapshot,
  getAccountSnapshots,
} from '../../../db/accountSnapshots';
import { error, success } from '../../../log';
import { toWeekDayDateStringFromTimestamp } from '../../../utils/date';
import { calculateFinanceOverview } from '../../../utils/money';

export default function SnapshotList() {
  var [list, setList] = useState([]);
  var getData = useCallback(
    function () {
      getAccountSnapshots()
        .then(function (accountSnapshots) {
          var snapshots = accountSnapshots.reduce(function (
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
          return Object.entries(snapshots).map(function (snap) {
            var overview = calculateFinanceOverview(snap[1]);
            overview.date_time = snap[0];
            return overview;
          });
        })
        .then(setList);
    },
    [setList]
  );

  useFocusEffect(getData);
  return (
    <Screen>
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
              onRightActionRelease={function () {
                Alert.alert('Confirm', 'Do you want to delete this snapshot?', [
                  {
                    text: 'Cancel',
                  },
                  {
                    text: 'Delete',
                    onPress: function () {
                      deleteAccountSnapshot(item.date_time)
                        .then(function () {
                          getData();
                          success('Snapshot removed');
                        })
                        .catch(function (e) {
                          error('Failed to remove snapshot', e);
                        });
                    },
                    style: 'destructive',
                  },
                ]);
              }}
              rightContent={<SwipeToDeleteContent />}
            >
              <ListItem style={{ justifyContent: 'space-between' }}>
                <Text category="c2" style={{ flex: 4 }}>
                  {toWeekDayDateStringFromTimestamp(parseInt(item.date_time))}
                </Text>
                <View
                  style={{
                    flex: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <MoneyDisplay
                    amount={item.liquidity}
                    style={{ marginRight: 25 }}
                    useParentheses
                    toFixed={0}
                  />
                  <MoneyDisplay
                    amount={item.networth}
                    useParentheses
                    toFixed={0}
                  />
                </View>
              </ListItem>
            </Swipeable>
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
});
