import React, { useState } from 'react';
import { Switch, View, TextInput } from 'react-native';
import { addDocument } from '../../firebaseHelper';
import theme from '../../theme';
import OutlineButton from '../../components/outlineButton';
import sharedStyles from '../../sharedStyles';

function ElectricityReadingAdd() {
  var [value, setValue] = useState('');
  var [cycleEnd, setCycleEnd] = useState(false);

  function resetForm() {
    setValue('');
    setCycleEnd(false);
  }

  function add() {
    addDocument('electricityReadings', {
      value: parseFloat(value),
      timestamp: new Date(),
      cycleEnd,
    }).then(resetForm);
  }

  return (
    <>
      <View
        style={[
          sharedStyles.formRow,
          sharedStyles.borderTop,
          { backgroundColor: 'transparent' },
        ]}
      >
        <TextInput
          key="valueInput"
          keyboardType="number-pad"
          value={value}
          onChangeText={text => setValue(text)}
          style={{
            flex: 3,
            fontSize: 16,
            backgroundColor: '#dddddd80',
            marginRight: 20,
            padding: 10,
            borderRadius: 5,
          }}
        />
        <Switch
          value={cycleEnd}
          onValueChange={val => setCycleEnd(val)}
          style={{ alignSelf: 'center' }}
        />
      </View>
      <View style={sharedStyles.formButtons}>
        <OutlineButton
          color={theme.colors.primary}
          label="Cancel"
          onPress={resetForm}
          style={[{ backgroundColor: 'transparent' }]}
        />
        <OutlineButton
          color={theme.colors.iosBlue}
          label="Add"
          onPress={add}
          style={[{ backgroundColor: 'transparent' }]}
        />
      </View>
    </>
  );
}
export default ElectricityReadingAdd;
