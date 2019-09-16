import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import theme from '../../theme';
import { toWeekDayDateString } from '../../../utils/date';
import MoneyDisplay from '../../components/moneyDisplay';
import Screen from '../../components/screen';

function SnapshotList(props) {
  return (
    <Screen>
      <FlatList
        data={props.financeSnapshots}
        keyExtractor={item => item._updatedOn.toString()}
        ListEmptyComponent={
          <View style={styles.emptyComponent}>
            <Text>No snapshots found.</Text>
          </View>
        }
        renderItem={({ item }) => {
          return (
            <View style={styles.listItem}>
              <View style={{ alignSelf: 'flex-start', marginBottom: 15 }}>
                <Text>{toWeekDayDateString(item._updatedOn)}</Text>
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

function mapStateToProps(state) {
  return {
    financeSnapshots: state.financeSnapshots,
  };
}

export default connect(mapStateToProps)(SnapshotList);
