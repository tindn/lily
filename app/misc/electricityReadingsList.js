import React from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import Screen from '../screen';
import ElectricityReadingItem from './electricityReadingItem';
import ElectricityReadingAdd from './electricityReadingAdd';

class ElectricityReadingsList extends React.Component {
  static navigationOptions = {
    headerTitle: 'Readings',
    headerRight: <ElectricityReadingAdd />,
  };
  render() {
    return (
      <Screen>
        <FlatList
          data={this.props.readings}
          renderItem={({ item, index }) => (
            <ElectricityReadingItem reading={item} index={index} />
          )}
          keyExtractor={item => item.id}
        />
      </Screen>
    );
  }
}

function mapStateToProps(state) {
  return {
    readings: state.electricityReadings,
  };
}

export default connect(mapStateToProps)(ElectricityReadingsList);
