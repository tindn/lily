import React from 'react';
import {
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import theme from '../../theme';
import DateInput from '../dateInput';
import MoneyInput from '../moneyInput';
import AccountEntryForm from './accountEntryForm';

class AccountEntry extends React.PureComponent {
  state = {
    expanded: false,
  };

  render() {
    return this.state.expanded ? (
      <AccountEntryForm
        entry={this.props.entry}
        onCancel={() => {
          LayoutAnimation.easeInEaseOut();
          this.setState({ expanded: !this.state.expanded });
        }}
      />
    ) : (
      <TouchableOpacity
        onPress={() => this.setState({ expanded: !this.state.expanded })}
        style={styles.item}
      >
        <View key="1">
          <DateInput
            date={this.props.entry.date}
            style={styles.date}
            disabled={true}
          />
          <Text style={{ fontSize: 16 }}>{this.props.entry.memo}</Text>
        </View>
        <MoneyInput
          amount={this.props.entry.amount}
          editable={false}
          textStyle={{
            fontSize: 20,
          }}
          type={this.props.entry.type}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  date: {
    fontSize: 18,
    marginBottom: 8,
  },
  item: {
    backgroundColor: theme.colors.backgroundColor,
    borderBottomColor: theme.colors.lighterGray,
    borderBottomWidth: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    paddingHorizontal: 10,
    paddingTop: 8,
  },
});

export default AccountEntry;
