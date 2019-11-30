import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import sharedStyles from '../sharedStyles';
import theme from '../theme';
import OutlineButton from './outlineButton';
import BottomSheet from './bottomSheet';

function mapStateToProps(state) {
  return {
    categories: state.categories,
  };
}

function CategoryInput(props) {
  var [showModal, setShowModal] = useState(false);
  return (
    <View>
      <TouchableOpacity
        onPress={function() {
          setShowModal(true);
        }}
        style={props.displayStyle}
      >
        <Text style={[sharedStyles.formTextInput, props.displayTextStyle]}>
          {props.current ? (
            props.current
          ) : (
            <Text style={{ color: theme.colors.lightGray }}>category</Text>
          )}
        </Text>
      </TouchableOpacity>
      <BottomSheet show={showModal} hide={() => setShowModal(false)}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            paddingTop: 20,
          }}
        >
          {props.categories.map(function(item) {
            let selected = item.name == props.current;
            return (
              <OutlineButton
                key={item.name}
                label={item.name}
                color={
                  selected ? theme.colors.primary : theme.colors.darkerGray
                }
                onPress={function() {
                  props.onPress(item.name);
                  // eslint-disable-next-line no-undef
                  setTimeout(function() {
                    setShowModal(false);
                  }, 150);
                }}
                style={{ margin: 5 }}
              />
            );
          })}
        </View>
        <OutlineButton
          onPress={() => setShowModal(false)}
          label="Cancel"
          color={theme.colors.primary}
          style={[
            {
              alignSelf: 'flex-end',
              marginTop: 20,
              marginRight: 20,
              marginBottom: 20,
            },
          ]}
          textStyle={{ textAlign: 'center' }}
        />
      </BottomSheet>
    </View>
  );
}

export default connect(mapStateToProps)(CategoryInput);
