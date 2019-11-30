import React, { useRef, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import sharedStyles from '../sharedStyles';
import theme from '../theme';
import BottomSheet from './bottomSheet';
import OutlineButton from './outlineButton';

function mapStateToProps(state) {
  var vendorIds = Object.keys(state.vendors);
  var vendorArray = Object.values(state.vendors);
  var vendorsByFirstLetters = vendorArray.reduce(function(acc, v) {
    var firstLetter = v.name[0];
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(v);
    return acc;
  }, {});
  return {
    vendors: state.vendors,
    vendorIds,
    vendorArray,
    vendorsByFirstLetters,
  };
}

function VendorInput(props) {
  var [showModal, setShowModal] = useState(false);
  var [filter, setFilter] = useState('all');
  var filterScrollRef = useRef(null);
  var vendorScrollRef = useRef(null);
  return (
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <TouchableOpacity
        onPress={function() {
          setShowModal(true);
          // eslint-disable-next-line no-undef
          setTimeout(function() {
            if (filterScrollRef.current && filter != 'all') {
              filterScrollRef.current.scrollToItem({ item: filter });
            }
            if (vendorScrollRef.current && props.selectedVendorId) {
              let vendorList =
                filter == 'all'
                  ? props.vendorArray
                  : props.vendorsByFirstLetters[filter];
              let scrollIndex = vendorList.findIndex(
                v => v.id == props.selectedVendorId
              );
              if (scrollIndex != -1) {
                if (scrollIndex > 2) {
                  scrollIndex = scrollIndex - 2;
                }
                vendorScrollRef.current.scrollToIndex({ index: scrollIndex });
              }
            }
          }, 250);
        }}
        style={[{ flex: 1 }, props.displayStyle]}
      >
        <Text style={props.displayTextStyle}>
          {props.selectedVendorId ? (
            props.vendors[props.selectedVendorId].name
          ) : (
            <Text style={{ color: theme.colors.lightGray }}>vendor</Text>
          )}
        </Text>
      </TouchableOpacity>
      <BottomSheet show={showModal} hide={() => setShowModal(false)}>
        <FlatList
          ref={vendorScrollRef}
          style={{ height: 250, marginTop: 20, marginBottom: 10 }}
          keyExtractor={(item, index) => index.toString()}
          data={
            filter == 'all'
              ? props.vendorArray
              : props.vendorsByFirstLetters[filter]
          }
          renderItem={function({ item }) {
            let selected = item.id == props.selectedVendorId;
            return (
              <TouchableOpacity
                style={[
                  sharedStyles.borderBottom,
                  { paddingLeft: 10, paddingVertical: 15 },
                  selected && { backgroundColor: theme.colors.secondary },
                ]}
                onPress={() => {
                  props.onVendorPress(item);
                  // eslint-disable-next-line no-undef
                  setTimeout(function() {
                    setShowModal(false);
                  }, 150);
                }}
              >
                <Text style={selected && { color: theme.colors.primary }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
          getItemLayout={(data, index) => ({
            length: 48,
            offset: 48 * index,
            index,
          })}
          onScrollToIndexFailed={() => {}}
        />
        <FlatList
          ref={filterScrollRef}
          data={Object.keys(props.vendorsByFirstLetters)}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          renderItem={function({ item }) {
            let selected = filter == item;
            return (
              <OutlineButton
                label={item}
                onPress={function() {
                  if (selected) {
                    setFilter('all');
                  } else {
                    setFilter(item);
                  }
                }}
                color={
                  selected ? theme.colors.primary : theme.colors.darkerGray
                }
                style={[
                  {
                    padding: 7,
                    margin: 5,
                  },
                ]}
              />
            );
          }}
        />

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

export default connect(mapStateToProps)(VendorInput);
