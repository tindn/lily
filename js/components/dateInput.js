import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { StyleSheet } from 'react-native';

function DateInput(props) {
  return (
    <DateTimePicker
      mode={props.mode || 'datetime'}
      minuteInterval={15}
      value={props.date}
      onChange={(event, date) => {
        props.onChange(date);
      }}
      style={StyleSheet.flatten([
        {
          height: 40,
          width: 130,
        },
        props.style,
      ])}
      display='compact'
    />
  );
}

export default DateInput;
