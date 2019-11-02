import React from 'react';
import {
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  Picker,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import OutlineButton from './outlineButton';
import theme from '../theme';
import sharedStyles from '../sharedStyles';

class PickerInput extends React.Component {
  static getDerivedStateFromProps(props) {
    return { value: props.value };
  }
  state = {
    showPicker: false,
  };
  render() {
    return (
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <TextInput
          value={this.state.value}
          onChangeText={this.props.onChangeText}
          style={[{ minWidth: 100 }, this.props.style]}
          placeholder={this.props.placeholder}
        />
        <TouchableOpacity
          onPress={() => this.setState({ showPicker: true })}
          style={{
            paddingHorizontal: 10,
          }}
        >
          <Icon name="caretdown" size={20} color={theme.colors.darkGray} />
        </TouchableOpacity>
        {this.state.showPicker && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.showPicker}
          >
            <SafeAreaView style={[sharedStyles.modalContainer]}>
              <View style={{ paddingBottom: 50 }}>
                <Picker
                  selectedValue={this.state.value}
                  onValueChange={this.props.onChangeText}
                >
                  {this.props.dropDownList.map(function(item, index) {
                    return (
                      <Picker.Item key={index} label={item} value={item} />
                    );
                  })}
                </Picker>
                <OutlineButton
                  onPress={() => this.setState({ showPicker: false })}
                  label="Done"
                  color={theme.colors.primary}
                  style={[
                    sharedStyles.outlineButton,
                    { alignSelf: 'center', marginTop: 20 },
                  ]}
                  textStyle={{ textAlign: 'center' }}
                />
              </View>
            </SafeAreaView>
          </Modal>
        )}
      </View>
    );
  }
}
export default PickerInput;
