import React from 'react';
import {
  SafeAreaView,
  View,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';

export default function BottomSheet(props) {
  return (
    <Modal animationType="fade" transparent={true} visible={props.show}>
      <View
        style={{
          backgroundColor: '#00000033',
          flex: 1,
          justifyContent: 'flex-end',
        }}
      >
        <TouchableWithoutFeedback onPress={props.hide}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
        <SafeAreaView
          style={[{ backgroundColor: '#fff' }, props.contentContainerStyle]}
        >
          {props.children}
        </SafeAreaView>
      </View>
    </Modal>
  );
}
