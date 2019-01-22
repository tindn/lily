import React from 'react';
import {
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import Screen from '../screen';
import Category from './category';
import LineItem from './lineItem';

class Accounts extends React.Component {
  static navigationOptions = {
    headerTitle: 'Accounts',
    headerRight: (
      <TouchableOpacity
        onPress={() =>
          Alert.alert('Confirm', 'Do you want to create a new snapshot?', [
            {
              text: 'Cancel',
              onPress: function() {},
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () =>
                fetch(
                  'https://us-central1-lily-cc62d.cloudfunctions.net/buildAccountsSnapshot',
                  { method: 'POST' }
                ),
            },
          ])
        }
        style={{ marginRight: 10 }}
      >
        <Icon name="addfolder" size={25} />
      </TouchableOpacity>
    ),
  };

  static getDerivedStateFromProps(props) {
    if (props.accounts) {
      const accounts = Object.values(props.accounts);
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
      return {
        liquidAssets,
        investments,
        fixedAssets,
        shortTermLiabilities,
        longTermLiabilities,
        totalAssetsBalance,
        totalLiabilitiesBalance,
      };
    }
    return null;
  }

  state = {
    showAssets: true,
    showLiabilities: true,
  };

  render() {
    return (
      <Screen>
        <ScrollView
          style={{
            paddingHorizontal: 5,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.setState({ showAssets: !this.state.showAssets });
              LayoutAnimation.easeInEaseOut();
            }}
            style={{
              paddingTop: 25,
              paddingBottom: 5,
            }}
          >
            <LineItem
              text="Total Assets"
              amount={this.state.totalAssetsBalance}
              textStyle={styles.total}
            />
          </TouchableOpacity>
          {this.state.showAssets && [
            <Category
              accounts={this.state.liquidAssets}
              name="Liquid"
              key="liquid"
              navigation={this.props.navigation}
            />,
            <Category
              accounts={this.state.investments}
              name="Investments"
              key="investments"
              navigation={this.props.navigation}
            />,
            <Category
              accounts={this.state.fixedAssets}
              name="Fixed"
              key="fixed"
              navigation={this.props.navigation}
            />,
          ]}

          <TouchableOpacity
            onPress={() => {
              this.setState({ showLiabilities: !this.state.showLiabilities });
              LayoutAnimation.easeInEaseOut();
            }}
            style={{ marginTop: 20, paddingTop: 25, paddingBottom: 5 }}
          >
            <LineItem
              text="Total Liabilities"
              amount={this.state.totalLiabilitiesBalance}
              textStyle={styles.total}
              negative
            />
          </TouchableOpacity>
          {this.state.showLiabilities && [
            <Category
              accounts={this.state.shortTermLiabilities}
              name="Short Term"
              key="short"
              negative
              navigation={this.props.navigation}
            />,
            <Category
              accounts={this.state.longTermLiabilities}
              name="Long Term"
              key="long"
              negative
              navigation={this.props.navigation}
            />,
          ]}
        </ScrollView>
      </Screen>
    );
  }
}

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
