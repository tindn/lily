import firebase from 'firebase';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import theme from '../../theme';
import Card from '../card';
import Screen from '../screen';

class Home extends React.PureComponent {
  static navigationOptions = {
    header: null,
  };

  state = {};

  static getDerivedStateFromProps(props) {
    if (props.electricityReadings && props.electricityReadings.length) {
      let lastReading = props.electricityReadings[0],
        monthStart = undefined;
      const cycleEndIndex = props.electricityReadings.indexOf(
        reading => reading.cycleEnd
      );
      if (cycleEndIndex === -1) {
        monthStart =
          props.electricityReadings[props.electricityReadings.length - 1];
      } else {
        monthStart = props.electricityReadings[cycleEndIndex];
      }

      const usageRate =
        (props.electricityReadings[0].value -
          props.electricityReadings[1].value) /
        ((props.electricityReadings[0].timestamp -
          props.electricityReadings[1].timestamp) /
          86400000);

      return {
        lastReading,
        monthStart,
        usedThisMonth: lastReading.value - monthStart.value,
        usageRate: usageRate.toFixed(2),
      };
    }
    return null;
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection('electricityReadings')
      .orderBy('timestamp', 'desc')
      .onSnapshot(
        function(snapshot) {
          let data = [];
          snapshot.forEach(function(doc) {
            let reading = doc.data();
            reading.id = doc.id;
            reading.timestamp = reading.timestamp.toDate();
            data.push(reading);
          });
          this.props.updateElectricityReadings(data);
        }.bind(this)
      );
  }

  render() {
    return (
      <Screen>
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          // refreshControl={
          //   <RefreshControl
          //     refreshing={this.state.refreshing}
          //     onRefresh={this.fetchData}
          //   />
          // }
        >
          <Card
            style={{
              paddingTop: 30,
              paddingBottom: 30,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: '600',
                }}
              >
                {this.state.usedThisMonth} kWh
              </Text>
              <Text
                style={{
                  color: theme.colors.darkGray,
                  fontSize: 12,
                  fontWeight: '500',
                }}
              >
                (this month)
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: '600',
                }}
              >
                {this.state.usageRate} kWh
              </Text>
              <Text
                style={{
                  color: theme.colors.darkGray,
                  fontSize: 12,
                  fontWeight: '500',
                }}
              >
                (usage rate)
              </Text>
            </View>
          </Card>
        </ScrollView>
      </Screen>
    );
  }
}

function mapStateToProps(state) {
  return {
    electricityReadings: state.electricityReadings,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateElectricityReadings(readings) {
      dispatch({ type: 'UPDATE_ELECTRICITY_READINGS', payload: readings });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
