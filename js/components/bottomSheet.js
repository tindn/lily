import React from 'react';
import {
  SafeAreaView,
  View,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import theme from '../theme';

export default function BottomSheet(props) {
  return (
    <Modal animationType="fade" transparent={true} visible={props.show}>
      <View
        style={{
          backgroundColor: '#00000053',
          flex: 1,
          justifyContent: 'flex-end',
        }}
      >
        <TouchableWithoutFeedback onPress={props.hide}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
        <SafeAreaView>
          <View
            style={[
              {
                backgroundColor: theme.colors.layerOne,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
              },
              props.contentContainerStyle,
            ]}
          >
            {props.children}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
