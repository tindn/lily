import React from 'react';
import { ScrollView, Text } from 'react-native';
import Screen from '../screen';
import Card from '../card';

class Home extends React.PureComponent {
  static navigationOptions = {
    header: null,
  };

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
            <Text>Misc</Text>
          </Card>
        </ScrollView>
      </Screen>
    );
  }
}

export default Home;
