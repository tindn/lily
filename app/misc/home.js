import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import theme from '../../theme';
import Card from '../card';
import Pill from '../pill';
import Screen from '../screen';
import ElectricityOverview from './electricityOverview';
import ElectricityReadingAdd from './electricityReadingAdd';

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
          </Card>

          <Card style={{ marginTop: 20 }}>
            <ElectricityReadingAdd />
          </Card>
          <View
            style={{
              marginTop: 25,
              paddingHorizontal: 50,
            }}
          >
            <Pill
              backgroundColor={theme.colors.primary}
              color={theme.colors.secondary}
              onPress={this.navigate('LargeDisplay')}
              style={{ padding: 12 }}
              label="Large Display"
              textStyle={{ textAlign: 'center' }}
            />
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  electricityReadingCard: {
    alignItems: 'center',
    flexDirection: 'column',
  },
});

export default Home;
