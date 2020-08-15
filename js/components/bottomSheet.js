import React from 'react';
import {
  View,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import theme from '../theme';
import sharedStyles from '../sharedStyles';
import { useSafeArea } from 'react-native-safe-area-context';

export default function BottomSheet(props) {
  const { bottom: paddingBottom } = useSafeArea();
  return (
    <Modal animationType="fade" transparent={true} visible={props.show}>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
        }}
      >
        <TouchableWithoutFeedback onPress={props.hide}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
        <View
          style={[
            {
              backgroundColor: theme.colors.layerOne,
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              paddingBottom,
            },
            sharedStyles.formContainer,
            props.contentContainerStyle,
          ]}
        >
          {props.children}
        </View>
      </View>
    </Modal>
  );
}
