import React from 'react';
import { FlatList, View, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import PlaidTransactionsList from './plaidTransactionsList';

var arr = ['JB Barclays', 'Simple', 'Amex Cash'];
const WIDTH = Dimensions.get('window').width;
function PlaidTransactionsCarousel(props) {
  return (
    <View style={{ height: 330 }}>
      <FlatList
        data={arr}
        keyExtractor={item => item}
        horizontal={true}
        getItemLayout={(data, index) => ({
          length: WIDTH,
          offset: WIDTH * index,
          index,
        })}
        renderItem={({ item }) => {
          var account = Object.values(props.accounts).find(a => a.name == item);
          if (!account) {
            return null;
          }
          return <PlaidTransactionsList accountName={item} account={account} />;
        }}
      />
    </View>
  );
}

function mapStateToProps(state) {
  return {
    accounts: state.accounts,
  };
}

export default connect(mapStateToProps)(PlaidTransactionsCarousel);
