import { useNavigation } from '@react-navigation/native';
import { Text } from 'components';
import React from 'react';
import { FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';
import sharedStyles from '../../sharedStyles';
import { toWeekDayDateStringFromTimestamp } from '../../utils/date';
import { formatAmountToDisplay } from '../../utils/money';

export default function TransactionList(props) {
  const navigation = useNavigation();
  return (
    <FlatList
      data={props.data}
      keyExtractor={(item) => item.id}
      refreshControl={
        props.fetchData ? (
          <RefreshControl
            refreshing={props.isRefreshing}
            onRefresh={props.fetchData}
          />
        ) : null
      }
      ListEmptyComponent={
        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#fff',
            padding: 20,
          }}
        >
          <Text>No transactions found.</Text>
        </View>
      }
      renderItem={({ item }) => {
        let dateDisplay = toWeekDayDateStringFromTimestamp(item.date_time);
        return (
          <TouchableOpacity
            style={[
              sharedStyles.listItem,
              { flexDirection: 'row', justifyContent: 'space-between' },
            ]}
            onPress={() => {
              navigation.navigate('TransactionDetails', {
                title: item.memo,
                transaction: item,
              });
            }}
          >
            <View>
              <Text>{dateDisplay}</Text>
              <Text style={{ marginTop: 7 }}>{item.category}</Text>
            </View>
            <View>
              <Text
                status={item.entry_type == 'credit' ? 'success' : 'danger'}
                style={{ textAlign: 'right' }}
              >
                {formatAmountToDisplay(item.amount)}
              </Text>
              <Text style={{ textAlign: 'right', marginTop: 7 }}>
                {(item.memo || item.vendor).slice(0, 25)}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}
