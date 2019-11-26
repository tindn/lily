import React, { useCallback, useState } from 'react';
import {
  Alert,
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import Pill from '../../components/pill';
import Screen from '../../components/screen';
import { buildAccountSnapshot } from '../../db/accountSnapshots';
import { getAllFromTable } from '../../db/shared';
import { useToggle } from '../../hooks';
import theme from '../../theme';
import Category from './category';
import LineItem from './lineItem';

function Accounts(props) {
  var [showAssets, toggleShowAssets] = useToggle(true);
  var [showLiabilities, toggleShowLiabilities] = useToggle(true);
  var [state, setState] = useState({
    liquidAssets: [],
    investments: [],
    fixedAssets: [],
    shortTermLiabilities: [],
    longTermLiabilities: [],
  });
  var fetchData = useCallback(function() {
    getAllFromTable('accounts').then(function(accounts) {
      let liquidAssets = [],
        investments = [],
        fixedAssets = [],
        shortTermLiabilities = [],
        longTermLiabilities = [],
        totalAssetsBalance = 0,
        totalLiabilitiesBalance = 0;
      accounts.forEach(function(account) {
        switch (account.category) {
          case 'Liquid Assets':
            liquidAssets.push(account);
            totalAssetsBalance += account.balance;
            break;
          case 'Investments':
            investments.push(account);
            totalAssetsBalance += account.balance;
            break;
          case 'Fixed Assets':
            fixedAssets.push(account);
            totalAssetsBalance += account.balance;
            break;
          case 'Short Term Liabilities':
            shortTermLiabilities.push(account);
            totalLiabilitiesBalance += account.balance;
            break;
          case 'Long Term Liabilities':
            longTermLiabilities.push(account);
            totalLiabilitiesBalance += account.balance;
            break;
        }
      });
      setState({
        liquidAssets,
        investments,
        fixedAssets,
        shortTermLiabilities,
        longTermLiabilities,
        totalAssetsBalance,
        totalLiabilitiesBalance,
      });
    });
  }, []);

  return (
    <Screen>
      <NavigationEvents
        onWillFocus={function() {
          fetchData();
        }}
      />
      <ScrollView
        style={{
          paddingHorizontal: 5,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            toggleShowAssets();
            LayoutAnimation.easeInEaseOut();
          }}
          style={{
            paddingTop: 25,
            paddingBottom: 5,
          }}
        >
          <LineItem
            text="Total Assets"
            amount={state.totalAssetsBalance}
            textStyle={styles.total}
          />
        </TouchableOpacity>
        {showAssets && [
          <Category
            accounts={state.liquidAssets}
            name="Liquid"
            key="liquid"
            navigation={props.navigation}
          />,
          <Category
            accounts={state.investments}
            name="Investments"
            key="investments"
            navigation={props.navigation}
          />,
          <Category
            accounts={state.fixedAssets}
            name="Fixed"
            key="fixed"
            navigation={props.navigation}
          />,
        ]}

        <TouchableOpacity
          onPress={() => {
            toggleShowLiabilities();
            LayoutAnimation.easeInEaseOut();
          }}
          style={{ marginTop: 20, paddingTop: 25, paddingBottom: 5 }}
        >
          <LineItem
            text="Total Liabilities"
            amount={state.totalLiabilitiesBalance}
            textStyle={styles.total}
            negative
          />
        </TouchableOpacity>
        {showLiabilities && [
          <Category
            accounts={state.shortTermLiabilities}
            name="Short Term"
            key="short"
            negative
            navigation={props.navigation}
          />,
          <Category
            accounts={state.longTermLiabilities}
            name="Long Term"
            key="long"
            negative
            navigation={props.navigation}
          />,
        ]}
        <Pill
          onPress={() =>
            Alert.alert('Confirm', 'Do you want to create a new snapshot?', [
              {
                text: 'Cancel',
                onPress: function() {},
                style: 'cancel',
              },
              {
                text: 'Yes',
                onPress: buildAccountSnapshot,
              },
            ])
          }
          label="Create snapshot"
          style={{
            padding: 12,
            marginTop: 25,
            marginHorizontal: 50,
          }}
          color={theme.colors.secondary}
          backgroundColor={theme.colors.primary}
          textStyle={{ textAlign: 'center' }}
        />
        <View style={{ paddingVertical: 25 }} />
      </ScrollView>
    </Screen>
  );
}

Accounts.navigationOptions = () => ({
  headerTitle: 'Accounts',
});

const styles = StyleSheet.create({
  total: {
    fontSize: 17,
    fontWeight: 'bold',
  },
});

function mapStateToProps(state) {
  return {
    accounts: state.accounts,
  };
}

export default connect(mapStateToProps)(Accounts);
