import { Text } from 'components';
import React from 'react';
import {
  LayoutAnimation,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import DateInput from '../../../components/dateInput';
import MoneyInput from '../../../components/moneyInput';
import { useToggle } from '../../../hooks';
import AccountEntryForm from './accountEntryForm';
import { toSimpleDateString } from '../../../utils/date';

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
      <View>
        <Text>{toSimpleDateString(new Date(props.entry.date_time))}</Text>
        <Text style={{ fontSize: 16 }}>{props.entry.memo}</Text>
      </View>
      <MoneyInput
        amount={props.entry.amount}
        editable={false}
        textStyle={{
          fontSize: 18,
        }}
        type={props.entry.entry_type}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  date: {
    marginBottom: 8,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    paddingHorizontal: 10,
    paddingTop: 8,
  },
});

export default AccountEntry;
