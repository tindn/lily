import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import LineItem from './lineItem';
import { by } from '../../../utils/sort';
import theme from '../../theme';

function Category(props) {
  const { accounts, name, negative, navigation } = props;
  const sum = accounts.reduce(function(accum, account) {
    return accum + account.balance;
  }, 0);
  return (
    <View
      style={{
        marginBottom: 15,
      }}
    >
      <View
        style={{
          marginTop: 5,
          paddingLeft: 5,
        }}
      >
        {accounts.sort(by('balance', 'desc')).map(account => (
          <TouchableOpacity
            key={account.id}
            onPress={() =>
              navigation.navigate('AccountDetails', {
                accountId: account.id,
                accountName: account.name,
              })
            }
            style={{ paddingTop: 5, paddingBottom: 5 }}
          >
            <LineItem
              text={account.name}
              amount={account.balance}
              negative={negative}
            />
          </TouchableOpacity>
        ))}
      </View>
      <LineItem
        text={name}
        amount={sum}
        negative={negative}
        style={{ borderTopWidth: 1, borderColor: theme.colors.lightGray }}
        textStyle={{
          paddingTop: 5,
          paddingLeft: 5,
          fontSize: 15,
          fontWeight: 'bold',
        }}
      />
    </View>
  );
}

export default Category;
