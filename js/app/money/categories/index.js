import React, { useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import { connect } from 'react-redux';
import OutlineButton from '../../../components/outlineButton';
import Pill from '../../../components/pill';
import Screen from '../../../components/screen';
import useToggle from '../../../hooks/useToggle';
import { addCategoryToDb } from '../../../redux/actions/categories';
import sharedStyles from '../../../sharedStyles';
import theme from '../../../theme';

function mapStateToProps(state) {
  return {
    categories: state.categories,
  };
}

var mapDispatchToProps = {
  addCategoryToDb: addCategoryToDb,
};

function Categories(props) {
  var [showAddForm, toggleAddForm] = useToggle();
  var [newCategory, setNewCategory] = useState('');

  return (
    <Screen>
      {showAddForm ? (
        <View style={[sharedStyles.formContainer, props.style]}>
          <View key="firstRow" style={[sharedStyles.formRow]}>
            <TextInput
              style={[
                sharedStyles.formTextInput,
                {
                  textAlign: 'left',
                },
              ]}
              value={newCategory}
              placeholder="Name"
              onChangeText={setNewCategory}
              placeholderTextColor={theme.colors.lightGray}
              autoFocus
            />
          </View>
          <View
            style={{
              marginVertical: 7,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            <OutlineButton
              label="Cancel"
              onPress={function() {
                setNewCategory('');
                toggleAddForm();
              }}
              color={theme.colors.darkGray}
            />
            <OutlineButton
              label="Save"
              onPress={function() {
                props.addCategoryToDb(newCategory).then(function() {
                  setNewCategory('');
                  toggleAddForm();
                });
              }}
            />
          </View>
        </View>
      ) : (
        <Pill
          label="Add"
          style={{
            alignSelf: 'center',
            marginVertical: 7,
          }}
          onPress={toggleAddForm}
        />
      )}
      <FlatList
        data={props.categories}
        renderItem={function({ item, index }) {
          return (
            <View
              key={`${index}`}
              style={[sharedStyles.formRow, sharedStyles.borderBottom]}
            >
              <Text
                style={[sharedStyles.formTextInput, { fontWeight: 'normal' }]}
              >
                {item.name}
              </Text>
            </View>
          );
        }}
      />
    </Screen>
  );
}

Categories.navigationOptions = {
  headerTitle: 'Categories',
};

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
