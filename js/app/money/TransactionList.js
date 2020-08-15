import { useNavigation } from '@react-navigation/native';
import { Text } from 'components';
import React from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import TransactionListItem from './TransactionListItem';

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
      style={props.style}
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
        return (
          <TransactionListItem
            item={item}
            onPress={() => {
              navigation.navigate('TransactionDetails', {
                title: item.memo,
                transaction: item,
              });
            }}
          />
        );
      }}
    />
  );
}
