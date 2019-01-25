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
                paddingTop: 10,
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
                  {this.state.usedThisMonth} kWh
                </Text>
                <Text style={styles.electricityReadingAnnotation}>
                  (actual)
                </Text>
              </View>
              <View>
                <Text style={styles.electricityReading}>
                  {(this.state.dailyAverage * 30).toFixed(0)} kWh
                </Text>
                <Text style={styles.electricityReadingAnnotation}>
                  (estimate)
                </Text>
              </View>
            </View>
            <View style={styles.electricityReadings}>
              <View>
                <Text style={styles.electricityReading}>
                  {this.state.daysElapsed} day(s)
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
    textAlign: 'center',
  },
  electricityReadingCard: {
    alignItems: 'center',
    flexDirection: 'column',
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
)(Home);
