import React from 'react';
import {
  SafeAreaView,
  View,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Layout } from '@ui-kitten/components';

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
        <SafeAreaView style={props.contentContainerStyle}>
          <Layout
            level="1"
            style={{ borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
          >
            {props.children}
          </Layout>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
