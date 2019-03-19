import React from 'react';
import { Switch, View, TextInput } from 'react-native';
import { addDocument } from '../../firebaseHelper';
import theme from '../../theme';
import OutlineButton from '../outlineButton';
import sharedStyles from '../sharedStyles';

class ElectricityReadingAdd extends React.Component {
  state = {
    value: '',
    cycleEnd: false,
  };

  render() {
    return (
      <>
        <View
          style={[
            sharedStyles.formRow,
            sharedStyles.borderBottom,
            { backgroundColor: 'transparent' },
          ]}
        >
          <TextInput
            key="valueInput"
            autoFocus={true}
            keyboardType="number-pad"
            value={this.state.value}
            onChangeText={text => this.setState({ value: text })}
            style={{ flex: 3, fontSize: 16 }}
          />
          <Switch
            value={this.state.cycleEnd}
            onValueChange={val => this.setState({ cycleEnd: val })}
          />
        </View>
        <View style={sharedStyles.formButtons}>
          <OutlineButton
            color={theme.colors.primary}
            label="Cancel"
            onPress={() => {
              this.setState({
                value: '',
                cycleEnd: false,
              });
            }}
            style={[
              sharedStyles.outlineButton,
              { backgroundColor: 'transparent' },
            ]}
          />
          <OutlineButton
            color={theme.colors.iosBlue}
            label="Add"
            onPress={() => {
              addDocument('electricityReadings', {
                value: parseFloat(this.state.value),
                timestamp: new Date(),
              });
            }}
            style={[
              sharedStyles.outlineButton,
              { backgroundColor: 'transparent' },
            ]}
          />
        </View>
      </>
    );
  }
}
export default ElectricityReadingAdd;
