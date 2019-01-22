import firebase from 'firebase';
import React from 'react';
import { Modal, SafeAreaView, Switch, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import theme from '../../theme';
import OutlineButton from '../outlineButton';
import sharedStyles from '../sharedStyles';
import Pill from '../pill';

class ElectricityReadingAdd extends React.Component {
  state = {
    showModal: false,
    value: '',
    cycleEnd: false,
  };

  closeModal = () => {
    this.setState({
      showModal: !this.state.showModal,
      value: '',
      cycleEnd: false,
    });
  };

  render() {
    return (
      <View
        style={{
          marginTop: 20,
        }}
      >
        <Pill
          backgroundColor={theme.colors.primary}
          color={theme.colors.secondary}
          onPress={() => this.setState({ showModal: !this.state.showModal })}
          style={{ padding: 12, marginLeft: 50, marginRight: 50 }}
          label="New Reading"
          textStyle={{ textAlign: 'center' }}
        />
        <Modal
          key="modal"
          animationType="slide"
          transparent={true}
          visible={this.state.showModal}
        >
          <SafeAreaView style={[sharedStyles.modalContainer]}>
            <View
              style={[
                sharedStyles.formRow,
                sharedStyles.borderBottom,
                { paddingTop: 100 },
              ]}
            >
              <TextInput
                key="valueInput"
                autoFocus={true}
                keyboardType="number-pad"
                value={this.state.value}
                onChangeText={text => this.setState({ value: text })}
              />
            </View>
            <View
              style={[
                sharedStyles.formRow,
                sharedStyles.borderBottom,
                sharedStyles.formSwitchRow,
              ]}
            >
              <Text>End of month</Text>
              <Switch
                value={this.state.cycleEnd}
                onValueChange={val => this.setState({ cycleEnd: val })}
              />
            </View>
            <View style={sharedStyles.formButtons}>
              <OutlineButton
                label="Cancel"
                onPress={this.closeModal}
                style={[sharedStyles.outlineButton]}
                color={theme.colors.darkGray}
              />
              <OutlineButton
                color={theme.colors.iosBlue}
                label="Add"
                onPress={() => {
                  firebase
                    .firestore()
                    .collection('electricityReadings')
                    .add({
                      value: parseFloat(this.state.value),
                      timestamp: new Date(),
                    })
                    .then(this.closeModal);
                }}
                style={[sharedStyles.outlineButton]}
              />
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    );
  }
}
export default ElectricityReadingAdd;
