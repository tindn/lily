import React, { useState } from 'react';
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

function AccountEntry(props) {
  const [expanded, setExpanded] = useState(false);

  return expanded ? (
    <AccountEntryForm
      entry={props.entry}
      onCancel={() => {
        LayoutAnimation.easeInEaseOut();
        setExpanded(!expanded);
      }}
    />
  ) : (
    <TouchableOpacity
      onPress={() => setExpanded(!expanded)}
      style={styles.item}
    >
      <View key="1">
        <DateInput
          date={props.entry.date}
          style={styles.date}
          disabled={true}
        />
        <Text style={{ fontSize: 16 }}>{props.entry.memo}</Text>
      </View>
      <MoneyInput
        amount={props.entry.amount}
        editable={false}
        textStyle={{
          fontSize: 20,
        }}
        type={props.entry.type}
      />
    </TouchableOpacity>
  );
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
