import React from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import Screen from '../../components/screen';
import ElectricityReadingItem from './electricityReadingItem';

class ElectricityReadingsList extends React.Component {
  static navigationOptions = {
    headerTitle: 'Readings',
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
