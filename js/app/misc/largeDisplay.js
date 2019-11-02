import React from 'react';
import { TextInput, Picker, View } from 'react-native';
import Screen from '../../components/screen';
import Pill from '../../components/pill';
import theme from '../../theme';

const commonPhrases = {
  0: { text: '', preferredFontSize: 75 },
  1: { text: 'Tin Nguyen', preferredFontSize: 69 },
  2: { text: '508-484-3184', preferredFontSize: 45 },
  3: { text: 'hi@tindn.io', preferredFontSize: 70 },
  4: { text: 'tindn14@gmail.com', preferredFontSize: 75 },
};

class LargeDisplay extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    value: '',
    fontSize: 75,
    showFontSizePicker: false,
    showCommonPhrasePicker: false,
  };

  toggleFontSizePicker = () => {
    this.setState({ showFontSizePicker: !this.state.showFontSizePicker });
  };

  toggleCommonPhrasePicker = () => {
    this.setState({
      showCommonPhrasePicker: !this.state.showCommonPhrasePicker,
    });
  };

  render() {
    return (
      <Screen style={{ marginHorizontal: 5 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ margin: 5, flex: 1 }}>
            {this.state.showCommonPhrasePicker && (
              <Picker
                style={{ height: 250 }}
                selectedValue={this.state.fontSize}
                onValueChange={text => {
                  this.setState({
                    value: commonPhrases[text].text,
                    fontSize: commonPhrases[text].preferredFontSize || 75,
                  });
                  this.toggleCommonPhrasePicker();
                }}
              >
                {Object.keys(commonPhrases).map(id => (
                  <Picker.Item
                    key={id}
                    label={commonPhrases[id].text}
                    value={id}
                  />
                ))}
              </Picker>
            )}

            <Pill
              backgroundColor={theme.colors.secondary}
              color={theme.colors.primary}
              onPress={this.toggleCommonPhrasePicker}
              style={{
                padding: 12,
              }}
              label="Common"
              textStyle={{ textAlign: 'center' }}
            />
          </View>
          <View style={{ margin: 5, width: 50 }}>
            {this.state.showFontSizePicker && (
              <Picker
                style={{ height: 250 }}
                selectedValue={this.state.fontSize}
                onValueChange={text =>
                  this.setState({ fontSize: parseInt(text) })
                }
              >
                {Array.from({ length: 200 }, function(val, index) {
                  let size = 40 + index;
                  return (
                    <Picker.Item key={size} label={`${size}`} value={size} />
                  );
                })}
              </Picker>
            )}
            <Pill
              backgroundColor={theme.colors.secondary}
              color={theme.colors.primary}
              onPress={this.toggleFontSizePicker}
              style={{
                padding: 12,
              }}
              label={this.state.fontSize}
              textStyle={{ textAlign: 'center' }}
            />
          </View>
        </View>
        <TextInput
          autoFocus={true}
          style={{
            fontSize: this.state.fontSize,
            marginTop: 10,
            color: theme.colors.primary,
            letterSpacing: 3,
          }}
          value={this.state.value}
          multiline={true}
          onChangeText={text => this.setState({ value: text })}
          autoCapitalize="none"
        />
      </Screen>
    );
  }
}

export default LargeDisplay;
