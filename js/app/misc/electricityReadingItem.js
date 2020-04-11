import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, ListItem, Text } from '@ui-kitten/components';
import React from 'react';
import {
  LayoutAnimation,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { deleteDocument, updateDocument } from '../../firebaseHelper';

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
      <>
        <ListItem
          onPress={() => {
            this.setState({ expanded: !this.state.expanded });
            LayoutAnimation.easeInEaseOut();
          }}
          style={styles.item}
        >
          <Text>
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
            style={{ fontWeight: '500' }}
            keyboardType="number-pad"
            value={this.state.value.toString()}
            onChangeText={text => this.setState({ value: text })}
          />
        </ListItem>
        {this.state.expanded && [
          <View key="datepicker" style={{ flex: 1 }}>
            <DateTimePicker
              mode="datetime"
              value={this.state.timestamp}
              onChange={(event, date) => {
                this.setState({ timestamp: date });
              }}
            />
          </View>,
          <View
            key="cycleEnd"
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 10,
            }}
          >
            <Text>End of month</Text>
            <Switch
              value={this.state.cycleEnd}
              onValueChange={val => this.setState({ cycleEnd: val })}
            />
          </View>,
          <View key="buttons" style={styles.buttons}>
            <Button
              size="small"
              status="basic"
              onPress={() => {
                LayoutAnimation.easeInEaseOut();
                this.setState({ expanded: !this.state.expanded });
              }}
            >
              Cancel
            </Button>
            <Button
              size="small"
              status="danger"
              onPress={() => {
                LayoutAnimation.easeInEaseOut();
                deleteDocument('electricityReadings', this.state.id);
              }}
            >
              Delete
            </Button>
            <Button
              size="small"
              onPress={() => {
                updateDocument('electricityReadings', this.state.id, {
                  timestamp: this.state.timestamp,
                  value: parseFloat(this.state.value),
                  cycleEnd: this.state.cycleEnd,
                });
                this.setState({ expanded: false });
                LayoutAnimation.easeInEaseOut();
              }}
            >
              Save
            </Button>
          </View>,
        ]}
      </>
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
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    marginTop: 30,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
});
