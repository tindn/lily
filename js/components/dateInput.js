import React from 'react';
import {
  // eslint-disable-next-line react-native/split-platform-components
  DatePickerIOS,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import theme from '../theme';
import { toSimpleDateString } from '../../utils/date';
import OutlineButton from './outlineButton';
import sharedStyles from '../sharedStyles';

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
            <DatePickerIOS
              mode={this.props.mode || 'datetime'}
              minuteInterval={15}
              date={this.props.date}
              onDateChange={this.props.onChange}
            />
            <OutlineButton
              onPress={this.toggleModal}
              label="Done"
              color={theme.colors.primary}
              style={[sharedStyles.outlineButton, styles.button]}
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
