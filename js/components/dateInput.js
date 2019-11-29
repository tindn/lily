import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { toSimpleDateString } from '../utils/date';
import sharedStyles from '../sharedStyles';
import theme from '../theme';
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
          disabled={this.props.disabled}
        >
          <Text style={styles.dateText}>
            {toSimpleDateString(this.props.date)}
          </Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.dateModalVisible}
        >
          <SafeAreaView style={sharedStyles.modalContainer}>
            <DateTimePicker
              mode={this.props.mode || 'datetime'}
              minuteInterval={15}
              value={this.props.date}
              onChange={(event, date) => {
                this.props.onChange(date);
              }}
            />
            <OutlineButton
              onPress={this.toggleModal}
              label="Done"
              color={theme.colors.primary}
              style={styles.button}
              textStyle={{ textAlign: 'center' }}
            />
          </SafeAreaView>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  dateText: {
    color: theme.colors.darkGray,
    fontSize: 20,
    fontWeight: '500',
  },
});

export default DateInput;
