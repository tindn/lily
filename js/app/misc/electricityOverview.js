import { Text } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { watchData } from '../../firebaseHelper';

const rate = 0.26;

class ElectricityOverview extends React.Component {
  static getDerivedStateFromProps(props) {
    if (props.electricityReadings && props.electricityReadings.length) {
      let lastReading = props.electricityReadings[0];
      let monthStart = props.electricityReadings.find(
        reading => reading.cycleEnd
      );
      if (!monthStart) {
        monthStart =
          props.electricityReadings[props.electricityReadings.length - 1];
      }

      const usedThisMonth = lastReading.value - monthStart.value;

      const daysElapsed =
        (lastReading.timestamp - monthStart.timestamp) / 86400000;

      const dailyAverage = usedThisMonth / daysElapsed;

      return {
        lastReading,
        monthStart,
        usedThisMonth,
        dailyAverage: dailyAverage.toFixed(2),
        daysElapsed: daysElapsed.toFixed(0),
      };
    }
    return null;
  }

  state = {};

  componentDidMount() {
    this.unsubscribe = watchData(
      'electricityReadings',
      [['orderBy', 'timestamp', 'desc']],
      this.props.updateElectricityReadings
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <>
        <View></View>
        <View style={styles.electricityReadings}>
          <View>
            <Text style={styles.electricityReading}>
              {this.state.usedThisMonth} kWh
            </Text>
            <Text style={styles.electricityReadingAnnotation}>(actual)</Text>
          </View>
          <View>
            <Text style={styles.electricityReading}>
              {(this.state.dailyAverage * 30).toFixed(0)} kWh
            </Text>
            <Text style={styles.electricityReadingAnnotation}>(estimate)</Text>
          </View>
        </View>
        <View style={styles.electricityReadings}>
          <View>
            <Text style={styles.electricityReading}>
              {this.state.dailyAverage} kWh/day
            </Text>
            <Text style={styles.electricityReadingAnnotation}>
              {this.state.daysElapsed} day{this.state.daysElapsed > 1 && 's'}{' '}
              this month
            </Text>
          </View>
          <View>
            <Text style={styles.electricityReading}>
              $ {(this.state.dailyAverage * 30 * rate).toFixed(0)}
            </Text>
            <Text style={styles.electricityReadingAnnotation}>(estimate)</Text>
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  electricityReading: {
    fontSize: 17,
    fontWeight: '600',
  },
  electricityReadingAnnotation: {
    fontSize: 12,
    textAlign: 'center',
  },
  electricityReadings: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    marginTop: 15,
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
)(ElectricityOverview);
