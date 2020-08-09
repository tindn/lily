import { Button } from 'components';
import React, { useState } from 'react';
import { Picker, TextInput, View } from 'react-native';
import Screen from '../../components/screen';
import { useToggle } from '../../hooks';
import { useThemeColors } from '../../uiKittenTheme';

const commonPhrases = {
  0: { text: '', preferredFontSize: 75 },
  1: { text: 'Tin Nguyen', preferredFontSize: 69 },
  2: { text: '508-484-3184', preferredFontSize: 45 },
  3: { text: 'hi@tindn.io', preferredFontSize: 70 },
  4: { text: 'tindn14@gmail.com', preferredFontSize: 75 },
};

function LargeDisplay() {
  var [value, setValue] = useState('');
  var [fontSize, setFontSize] = useState(75);
  var [showFontSizePicker, toggleFontSizePicker] = useToggle();
  var [showCommonPhrasePicker, toggleCommonPhrasePicker] = useToggle();
  var themeColors = useThemeColors();

  return (
    <Screen style={{ marginHorizontal: 5 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <View style={{ margin: 5, flex: 1 }}>
          {showCommonPhrasePicker && (
            <Picker
              style={{ height: 250 }}
              selectedValue={fontSize}
              onValueChange={text => {
                setValue(commonPhrases[text].text);
                setFontSize(commonPhrases[text].preferredFontSize || 75);
                toggleCommonPhrasePicker();
              }}
            >
              {Object.keys(commonPhrases).map(id => (
                <Picker.Item
                  key={id}
                  label={commonPhrases[id].text}
                  value={id}
                  color={themeColors.textColor}
                />
              ))}
            </Picker>
          )}

          <Button onPress={toggleCommonPhrasePicker}>Common</Button>
        </View>
        <View style={{ margin: 5, width: 70 }}>
          {showFontSizePicker && (
            <Picker
              style={{ height: 250 }}
              selectedValue={fontSize}
              onValueChange={text => setFontSize(parseInt(text))}
            >
              {Array.from({ length: 200 }, function(val, index) {
                let size = 40 + index;
                return (
                  <Picker.Item
                    key={size}
                    label={`${size}`}
                    value={size}
                    color={themeColors.textColor}
                  />
                );
              })}
            </Picker>
          )}
          <Button onPress={toggleFontSizePicker}>{fontSize.toString()}</Button>
        </View>
      </View>
      <TextInput
        autoFocus={true}
        style={{
          fontSize: fontSize,
          marginTop: 10,
          color: themeColors.textColor,
          letterSpacing: 3,
        }}
        value={value}
        onChangeText={setValue}
        autoCapitalize="none"
      />
    </Screen>
  );
}

export default LargeDisplay;
