import { Button, Input } from '@ui-kitten/components';
import React, { useState } from 'react';
import { Switch, View } from 'react-native';
import { addDocument } from '../../firebaseHelper';
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
        <Input
          keyboardType="number-pad"
          value={value}
          onChangeText={text => setValue(text)}
          style={{
            flex: 3,
            fontSize: 16,
            marginRight: 20,
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
        <Button size="small" status="basic" onPress={resetForm}>
          Cancel
        </Button>
        <Button size="small" onPress={add}>
          Add
        </Button>
      </View>
    </>
  );
}
export default ElectricityReadingAdd;
