import React from 'react';
import {
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DateInput from '../../components/dateInput';
import MoneyInput from '../../components/moneyInput';
import { useToggle } from '../../hooks';
import theme from '../../theme';
import AccountEntryForm from './accountEntryForm';

function AccountEntry(props) {
  const [expanded, toggleExpanded] = useToggle();

  return expanded ? (
    <AccountEntryForm
      entry={props.entry}
      onCancel={() => {
        LayoutAnimation.easeInEaseOut();
        toggleExpanded();
      }}
      onEntryChange={props.onEntryChange}
      accountId={props.accountId}
    />
  ) : (
    <TouchableOpacity onPress={toggleExpanded} style={styles.item}>
      <View key="1">
        <DateInput
          date={new Date(props.entry.date_time)}
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
