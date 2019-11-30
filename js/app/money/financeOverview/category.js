import React from 'react';
import { LayoutAnimation, View } from 'react-native';
import { useToggle } from '../../../hooks';
import theme from '../../../theme';
import { by } from '../../../utils/sort';
import LineItem from './lineItem';

function Category(props) {
  const { accounts, name, negative, navigation } = props;
  var [showCategoryDetails, toggleDetails] = useToggle(true);

  const sum = accounts.reduce(function(accum, account) {
    return accum + account.balance;
  }, 0);
  return (
    <View
      style={{
        marginVertical: 5,
        paddingLeft: 5,
      }}
    >
      <LineItem
        text={name}
        amount={sum}
        negative={negative}
        style={{ borderBottomWidth: 1, borderColor: theme.colors.lightGray }}
        textStyle={{
          paddingBottom: 5,
          paddingLeft: 5,
          fontSize: 15,
          fontWeight: 'bold',
        }}
        onPress={() => {
          toggleDetails();
          LayoutAnimation.easeInEaseOut();
        }}
      />
      {showCategoryDetails ? (
        <View
          style={{
            paddingLeft: 10,
            paddingTop: 10,
          }}
        >
          {accounts.sort(by('balance', 'desc')).map(account => (
            <LineItem
              key={account.id}
              onPress={() =>
                navigation.navigate('AccountDetails', {
                  accountId: account.id,
                  accountName: account.name,
                })
              }
              style={{ paddingTop: 5, paddingBottom: 5 }}
              text={account.name}
              amount={account.balance}
              negative={negative}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default Category;
