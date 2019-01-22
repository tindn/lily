import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { watchData } from '../../firebaseHelper';
import theme from '../../theme';
import Card from '../card';
import Screen from '../screen';
import ElectricityReadingAdd from './electricityReadingAdd';

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

      const usedThisMonth = lastReading.value - monthStart.value;

      const dailyAverage =
        usedThisMonth /
        ((props.electricityReadings[0].timestamp - monthStart.timestamp) /
          86400000);

      return {
        lastReading,
        monthStart,
        usedThisMonth,
        usageRate: usageRate.toFixed(2),
        dailyAverage: dailyAverage.toFixed(2),
      };
    }
    return null;
  }

  componentDidMount() {
    watchData(
      'electricityReadings',
      [['orderBy', 'timestamp', 'desc']],
      this.props.updateElectricityReadings
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
            onPress={() =>
              this.props.navigation.navigate('ElectricityReadingsList')
            }
            style={styles.electricityReadingCard}
          >
            <View
              style={{
                paddingTop: 20,
              }}
            >
              <Text
                style={{
                  fontWeight: '700',
                  color: theme.colors.green,
                  fontSize: 17,
                }}
              >
                Electricity
              </Text>
            </View>
            <View style={styles.electricityReadings}>
              <View>
                <Text style={styles.electricityReading}>
                  {this.state.usageRate} kWh
                </Text>
                <Text style={styles.electricityReadingAnnotation}>
                  (usage rate)
                </Text>
              </View>
              <View>
                <Text style={styles.electricityReading}>
                  {this.state.usedThisMonth} kWh
                </Text>
                <Text style={styles.electricityReadingAnnotation}>
                  (this month)
                </Text>
              </View>
              <View>
                <Text style={styles.electricityReading}>
                  {this.state.dailyAverage} kWh
                </Text>
                <Text style={styles.electricityReadingAnnotation}>
                  (daily average)
                </Text>
              </View>
            </View>
          </Card>
          <ElectricityReadingAdd />
        </ScrollView>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  electricityReading: {
    fontSize: 17,
    fontWeight: '600',
  },
  electricityReadingAnnotation: {
    color: theme.colors.darkGray,
    fontSize: 12,
    fontWeight: '500',
  },
  electricityReadingCard: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  electricityReadings: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 30,
    paddingTop: 20,
    width: '100%',
  },
});

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
