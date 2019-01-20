import firebase from 'firebase';
import React from 'react';
import {
  Modal,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';
import theme from '../../theme';
import OutlineButton from '../outlineButton';
import Screen from '../screen';

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
    const icon = this.state.showModal ? 'close' : 'plus';
    return [
      <TouchableOpacity
        key="trigger"
        onPress={() => this.setState({ showModal: !this.state.showModal })}
        style={styles.trigger}
      >
        <Icon name={icon} size={25} color={theme.colors.iosBlue} />
      </TouchableOpacity>,
      <Modal
        key="modal"
        animationType="slide"
        transparent={true}
        visible={this.state.showModal}
      >
        <Screen style={styles.container}>
          <TextInput
            key="valueInput"
            autoFocus={true}
            style={styles.input}
            keyboardType="number-pad"
            value={this.state.value}
            onChangeText={text => this.setState({ value: text })}
          />
          <View style={styles.switch}>
            <Text>End of month</Text>
            <Switch
              value={this.state.cycleEnd}
              onValueChange={val => this.setState({ cycleEnd: val })}
            />
          </View>
          <View style={styles.buttons}>
            <OutlineButton
              label="Cancel"
              onPress={this.closeModal}
              style={[styles.button]}
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
              style={[styles.button]}
            />
          </View>
        </Screen>
      </Modal>,
    ];
  }
}
export default ElectricityReadingAdd;

const styles = StyleSheet.create({
  button: {
    paddingBottom: 7,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 7,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
    paddingHorizontal: 50,
    width: '100%',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: '500',
  },
  switch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 50,
    width: '100%',
  },
  trigger: {
    marginRight: 10,
  },
});
