import { Text } from 'components';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import sharedStyles from '../../sharedStyles';
import { toWeekDayDateStringFromTimestamp } from '../../utils/date';
import { formatAmountToDisplay } from '../../utils/money';

export default function TransactionListItem({ item, onPress }) {
  let dateDisplay = toWeekDayDateStringFromTimestamp(item.date_time);
  return (
    <TouchableOpacity
      style={[
        sharedStyles.listItem,
        { flexDirection: 'row', justifyContent: 'space-between' },
      ]}
      onPress={onPress}
    >
      <View>
        <Text>{dateDisplay}</Text>
        <Text style={{ marginTop: 7 }}>{item.category}</Text>
      </View>
      <View>
        <Text
          status={item.entry_type == 'credit' ? 'success' : 'danger'}
          style={{ textAlign: 'right' }}
        >
          {formatAmountToDisplay(item.amount)}
        </Text>
        <Text style={{ textAlign: 'right', marginTop: 7 }}>
          {(item.memo || item.vendor).slice(0, 25)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
