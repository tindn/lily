import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Text } from 'components';
import React, { useState } from 'react';
import { Modal, SafeAreaView, TouchableOpacity, View } from 'react-native';
import sharedStyles from '../sharedStyles';
import { useThemeColors } from '../uiKittenTheme';
import { toSimpleDateString } from '../utils/date';

function DateInput(props) {
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const colors = useThemeColors();
  return (
    <View style={props.style}>
      <TouchableOpacity
        onPress={() => {
          setDateModalVisible(!dateModalVisible);
          props.onFocus && props.onFocus();
        }}
        disabled={props.disabled}
      >
        <Text
          appearance="hint"
          category="h6"
          style={{ fontWeight: 'normal', color: colors.textColor }}
        >
          {toSimpleDateString(props.date)}
        </Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={dateModalVisible}
      >
        <SafeAreaView
          style={[
            sharedStyles.modalContainer,
            { backgroundColor: colors.backgroundColor1 },
          ]}
        >
          <DateTimePicker
            mode={props.mode || 'datetime'}
            minuteInterval={15}
            value={props.date}
            onChange={(event, date) => {
              props.onChange(date);
            }}
          />
          <Button
            onPress={() => setDateModalVisible(!dateModalVisible)}
            style={{ alignSelf: 'center', marginVertical: 18 }}
          >
            Done
          </Button>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

export default DateInput;
