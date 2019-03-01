import React from 'react';
import {
  Modal,
  SafeAreaView,
  Switch,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import theme from '../../theme';
import OutlineButton from '../outlineButton';
import sharedStyles from '../sharedStyles';
import Icon from 'react-native-vector-icons/AntDesign';
import { addDocument } from '../../firebaseHelper';

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
        <TouchableOpacity
          style={{ bottom: 10, right: 10 }}
          onPress={() => this.setState({ showModal: !this.state.showModal })}
        >
          <Icon name="plus" size={25} color={theme.colors.iosBlue} />
        </TouchableOpacity>
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
                  addDocument('electricityReadings', {
                    value: parseFloat(this.state.value),
                    timestamp: new Date(),
                  }).then(this.closeModal);
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
