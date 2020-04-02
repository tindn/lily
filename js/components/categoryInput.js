import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import sharedStyles from '../sharedStyles';
import theme from '../theme';
import OutlineButton from './outlineButton';
import BottomSheet from './bottomSheet';
import { Button } from '@ui-kitten/components';

function mapStateToProps(state) {
  return {
    categories: state.categories.filter(c => !c.is_archived),
  };
}

function CategoryInput(props) {
  var [showModal, setShowModal] = useState(false);
  return (
    <>
      <TouchableOpacity
        onPress={function() {
          setShowModal(true);
        }}
        style={[{ flex: 1 }, props.displayStyle]}
      >
        <Text style={[sharedStyles.formTextInput, props.displayTextStyle]}>
          {props.current ? (
            props.current
          ) : (
            <Text style={{ color: theme.colors.lightGray }}>Category</Text>
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
              <Button
                key={item.name}
                label={item.name}
                appearance="outline"
                size="small"
                status={selected ? 'success' : 'basic'}
                onPress={function() {
                  props.onPress(item.name);
                  // eslint-disable-next-line no-undef
                  setTimeout(function() {
                    setShowModal(false);
                  }, 150);
                }}
                style={{ margin: 8 }}
              >
                {item.name}
              </Button>
            );
          })}
        </View>
        <Button
          appearance="outline"
          status="basic"
          onPress={() => setShowModal(false)}
          style={{
            alignSelf: 'flex-end',
            marginTop: 20,
            marginRight: 20,
            marginBottom: 20,
          }}
        >
          Cancel
        </Button>
      </BottomSheet>
    </>
  );
}

export default connect(mapStateToProps)(CategoryInput);
