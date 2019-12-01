import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Swipeable from 'react-native-swipeable-row';
import { connect } from 'react-redux';
import OutlineButton from '../../../components/outlineButton';
import Screen from '../../../components/screen';
import SwipeToArchiveContent from '../../../components/Swipeable/SwipeToArchiveContent';
import { error } from '../../../log';
import {
  addCategoryToDb,
  archiveCategoryToDb,
  saveCategoryToDb,
  unarchiveCategoryToDb,
} from '../../../redux/actions/categories';
import sharedStyles from '../../../sharedStyles';
import theme from '../../../theme';

function mapStateToProps(state) {
  return {
    categories: state.categories,
  };
}

var mapDispatchToProps = {
  addCategoryToDb: addCategoryToDb,
  archiveCategoryToDb: archiveCategoryToDb,
  saveCategoryToDb: saveCategoryToDb,
  unarchiveCategoryToDb: unarchiveCategoryToDb,
};

function Categories(props) {
  var [newCategory, setNewCategory] = useState('');
  var [oldCategory, setOldCategory] = useState();
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
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
                setOldCategory(undefined);
              }}
              color={theme.colors.darkGray}
            />
            <OutlineButton
              label={oldCategory ? 'Save' : 'Add'}
              onPress={function() {
                if (oldCategory) {
                  props
                    .saveCategoryToDb(oldCategory, newCategory)
                    .then(function() {
                      setOldCategory(undefined);
                      setNewCategory('');
                    });
                } else {
                  props.addCategoryToDb(newCategory).then(function() {
                    setNewCategory('');
                  });
                }
              }}
            />
          </View>
        </View>

        {props.categories.map(function(item, index) {
          return (
            <Swipeable
              key={index.toString()}
              rightContent={<SwipeToArchiveContent />}
              rightActionActivationDistance={175}
              onRightActionRelease={function() {
                Alert.alert('Confirm', `Do you want to archive ${item.name}?`, [
                  {
                    text: 'Cancel',
                  },
                  {
                    text: 'Archive',
                    onPress: function() {
                      props.archiveCategoryToDb(item.name).catch(function(e) {
                        error('Failed to archive category', e.message);
                      });
                    },
                    style: 'destructive',
                  },
                ]);
              }}
              leftContent={
                <View
                  style={{
                    backgroundColor: theme.colors.primary,
                    justifyContent: 'center',
                    flex: 1,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: '500',
                      fontSize: 18,
                      color: theme.colors.white,
                      paddingLeft: 10,
                      textAlign: 'right',
                      paddingRight: 5,
                    }}
                  >
                    Un-Archive
                  </Text>
                </View>
              }
              leftActionActivationDistance={175}
              onLeftActionRelease={function() {
                Alert.alert(
                  'Confirm',
                  `Do you want to un-archive ${item.name}?`,
                  [
                    {
                      text: 'Cancel',
                    },
                    {
                      text: 'Un-Archive',
                      onPress: function() {
                        props
                          .unarchiveCategoryToDb(item.name)
                          .catch(function(e) {
                            error('Failed to un-archive category', e.message);
                          });
                      },
                      style: 'destructive',
                    },
                  ]
                );
              }}
            >
              <TouchableOpacity
                style={[
                  sharedStyles.formRow,
                  sharedStyles.borderBottom,
                  { paddingVertical: 15 },
                ]}
                onPress={function() {
                  setOldCategory(item.name);
                  setNewCategory(item.name);
                }}
                disabled={item.is_archived}
              >
                <Text>{item.name}</Text>
                {item.is_archived ? (
                  <OutlineButton
                    label="Archived"
                    disabled
                    style={{ position: 'absolute', right: 5, top: 5 }}
                  />
                ) : null}
              </TouchableOpacity>
            </Swipeable>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

Categories.navigationOptions = {
  headerTitle: 'Categories',
};

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
