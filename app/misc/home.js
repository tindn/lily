import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import theme from '../../theme';
import Card from '../card';
import Pill from '../pill';
import Screen from '../screen';
import ElectricityOverview from './electricityOverview';
import ElectricityReadingAdd from './electricityReadingAdd';
import Counter from './Counter';

class Home extends React.PureComponent {
  static navigationOptions = {
    header: null,
  };

  state = {};

  navigate = route => {
    return () => {
      this.props.navigation.navigate(route);
    };
  };

  render() {
    return (
      <Screen>
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
        >
          <Card
            onPress={this.navigate('ElectricityReadingsList')}
            style={styles.electricityReadingCard}
          >
            <ElectricityOverview />
            <ElectricityReadingAdd />
          </Card>

          <Card
            style={{ paddingVertical: 15, marginTop: 25, alignItems: 'center' }}
            onPress={this.navigate('LargeDisplay')}
          >
            <Text style={{}}>Large Display</Text>
          </Card>
        </ScrollView>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  electricityReadingCard: {
    flexDirection: 'column',
  },
});

export default Home;
