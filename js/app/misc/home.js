import { Button } from '@ui-kitten/components';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Card from '../../components/card';
import Screen from '../../components/screen';
import ElectricityOverview from './electricityOverview';
import ElectricityReadingAdd from './electricityReadingAdd';

function Home(props) {
  return (
    <Screen>
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
      >
        <Card
          onPress={() => props.navigation.navigate('ElectricityReadingsList')}
          style={styles.electricityReadingCard}
        >
          <ElectricityOverview />
          <ElectricityReadingAdd />
        </Card>
        <Button
          style={{ marginTop: 20, marginHorizontal: 10 }}
          onPress={() => props.navigation.navigate('LargeDisplay')}
        >
          Large Display
        </Button>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  electricityReadingCard: {
    flexDirection: 'column',
  },
});

export default Home;
