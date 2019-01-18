import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';

function Account(props) {
  return (
    <View>
      <Text>Account page</Text>
    </View>
  );
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Account);
