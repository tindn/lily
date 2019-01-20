import firebase from 'firebase';
import React from 'react';
import {
  DatePickerIOS,
  LayoutAnimation,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import theme from '../../theme';
import OutlineButton from '../outlineButton';
import { connect } from 'react-redux';

class ElectricityReadingItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      increase: props.previous
        ? props.reading.value - props.previous.value
        : undefined,
      timeDiff: props.previous
        ? (props.reading.timestamp - props.previous.timestamp) / 86400000
        : undefined,
      ...props.reading,
    };
  }
  state = {
    expanded: false,
  };

  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.setState({ expanded: !this.state.expanded });
            LayoutAnimation.easeInEaseOut();
          }}
          style={styles.item}
        >
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={{ color: theme.colors.darkGray }}>
              {this.state.timestamp &&
                this.state.timestamp.toLocaleDateString('en-US', {
                  weekday: 'short',
                  day: '2-digit',
                  month: '2-digit',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
            </Text>
            {this.state.increase && (
              <Text>
                {this.state.increase} (
                {(this.state.increase / this.state.timeDiff).toFixed(2)})
              </Text>
            )}
            <TextInput
              editable={this.state.expanded}
              key="valueInput"
              style={{ fontWeight: '500' }}
              keyboardType="number-pad"
              value={this.state.value.toString()}
              onChangeText={text => this.setState({ value: text })}
            />
          </View>
          {this.state.expanded && [
            <View key="datepicker" style={{ flex: 1 }}>
              <DatePickerIOS
                date={this.state.timestamp}
                onDateChange={date => this.setState({ timestamp: date })}
              />
            </View>,
            <View
              key="cycleEnd"
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text>End of month</Text>
              <Switch
                value={this.state.cycleEnd}
                onValueChange={val => this.setState({ cycleEnd: val })}
              />
            </View>,
            <View key="buttons" style={styles.buttons}>
              <OutlineButton
                label="Cancel"
                onPress={() => {
                  LayoutAnimation.easeInEaseOut();
                  this.setState({ expanded: !this.state.expanded });
                }}
                style={[styles.button]}
                color={theme.colors.darkGray}
              />
              <OutlineButton
                color={theme.colors.red}
                label="Delete"
                onPress={() => {
                  LayoutAnimation.easeInEaseOut();
                  firebase
                    .firestore()
                    .collection('electricityReadings')
                    .doc(this.state.id)
                    .delete();
                }}
                style={[styles.button]}
              />
              <OutlineButton
                color={theme.colors.iosBlue}
                label="Save"
                onPress={() => {
                  firebase
                    .firestore()
                    .collection('electricityReadings')
                    .doc(this.state.id)
                    .update({
                      timestamp: this.state.timestamp,
                      value: parseFloat(this.state.value),
                      cycleEnd: this.state.cycleEnd,
                    });
                  this.setState({ expanded: false });
                  LayoutAnimation.easeInEaseOut();
                }}
                style={[styles.button]}
              />
            </View>,
          ]}
        </TouchableOpacity>
      </View>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    previous: state.electricityReadings[ownProps.index + 1],
  };
}

export default connect(mapStateToProps)(ElectricityReadingItem);

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
    marginTop: 30,
  },
  item: {
    borderBottomColor: theme.colors.lighterGray,
    borderBottomWidth: 1,
    flex: 1,
    flexDirection: 'column',
    paddingBottom: 20,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
});
