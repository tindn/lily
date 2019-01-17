import React from 'react';
import {
  DatePickerIOS,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import theme from '../theme';
import { toSimpleDateString } from '../utils';
import OutlineButton from './outlineButton';

class DateInput extends React.PureComponent {
  state = {
    dateModalVisible: false,
  };

  toggleModal = () =>
    this.setState({ dateModalVisible: !this.state.dateModalVisible });

  render() {
    return (
      <View style={this.props.style}>
        <TouchableOpacity
          onPress={() => {
            this.toggleModal();
            this.props.onFocus && this.props.onFocus();
          }}
        >
          <Text style={sharedStyles.dateText}>
            {toSimpleDateString(this.props.date)}
          </Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.dateModalVisible}
        >
          <View style={sharedStyles.datePickerModal}>
            <DatePickerIOS
              mode="datetime"
              minuteInterval={15}
              date={this.props.date}
              onDateChange={this.props.onChange}
            />
            <OutlineButton
              onPress={this.toggleModal}
              label="Done"
              color={theme.colors.primary}
              style={{
                width: 100,
                alignSelf: 'center',
                padding: 5,
              }}
              textStyle={{ textAlign: 'center' }}
            />
          </View>
        </Modal>
      </View>
    );
  }
}

const sharedStyles = StyleSheet.create({
  dateText: {
    fontSize: 20,
    color: theme.colors.darkGray,
    fontWeight: '500',
  },
  datePickerModal: {
    backgroundColor: '#fff',
    top: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
});

export default DateInput;
