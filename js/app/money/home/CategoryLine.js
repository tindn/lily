import { Text } from '@ui-kitten/components';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import BottomSheet from '../../../components/bottomSheet';
import MoneyDisplay from '../../../components/MoneyDisplay';
import { useToggle } from '../../../hooks';
import sharedStyles from '../../../sharedStyles';
import theme from '../../../theme';
import CategoryHistory from './CategoryHistory';

export default function CategoryLine(props) {
  const [showHistory, toggleShowHistory] = useToggle();

  return (
    <>
      <TouchableOpacity
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 5,
            marginBottom: 10,
          },
          sharedStyles.borderBottom,
          props.style,
        ]}
        onPress={props.onPress}
        onLongPress={toggleShowHistory}
      >
        <Text style={{ fontSize: 16 }}>{props.category.name}</Text>
        <MoneyDisplay
          amount={props.category.amount}
          useParentheses={false}
          style={{ fontSize: 16 }}
          type="debit"
        />
      </TouchableOpacity>
      <BottomSheet show={showHistory} hide={toggleShowHistory}>
        <CategoryHistory {...props.category} hide={toggleShowHistory} />
      </BottomSheet>
    </>
  );
}
