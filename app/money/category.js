import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import LineItem from './lineItem';

function Category(props) {
  const { accounts, name, negative, navigation } = props;
  const sum = accounts.reduce(function(accum, account) {
    return accum + account.balance;
  }, 0);
  return (
    <View
      style={{
        marginTop: 15,
        paddingLeft: 5,
      }}
    >
      <LineItem
        text={name}
        amount={sum}
        negative={negative}
        textStyle={{ fontSize: 16, fontWeight: 'bold', opacity: 0.7 }}
      />
      <View
        style={{
          marginTop: 5,
          paddingLeft: 5,
        }}
      >
        {accounts
          .sort((a, b) => b.balance - a.balance)
          .map(account => (
            <TouchableOpacity
              key={account.id}
              onPress={() => navigation.navigate('Account')}
            >
              <LineItem
                text={account.name}
                amount={account.balance}
                negative={negative}
                style={{ paddingTop: 5, paddingBottom: 5 }}
              />
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
}

export default Category;
