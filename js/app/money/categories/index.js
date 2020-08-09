import { Button, Input, Text } from 'components';
import React, { useState } from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-swipeable-row';
import { connect } from 'react-redux';
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
        <View level="4" style={{ marginVertical: 10, paddingHorizontal: 10 }}>
          <Input
            value={newCategory}
            placeholder="Name"
            onChangeText={setNewCategory}
            placeholderTextColor={theme.colors.lightGray}
          />
          <View
            style={{
              marginVertical: 7,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            <Button
              label="Cancel"
              onPress={function () {
                setNewCategory('');
                setOldCategory(undefined);
              }}
              status="basic"
              size="small"
            >
              Cancel
            </Button>
            <Button
              size="small"
              onPress={function () {
                if (oldCategory) {
                  props
                    .saveCategoryToDb(oldCategory, newCategory)
                    .then(function () {
                      setOldCategory(undefined);
                      setNewCategory('');
                    });
                } else {
                  props.addCategoryToDb(newCategory).then(function () {
                    setNewCategory('');
                  });
                }
              }}
            >
              {oldCategory ? 'Save' : 'Add'}
            </Button>
          </View>
        </View>

        {props.categories.map(function (item, index) {
          return (
            <Swipeable
              key={index.toString()}
              rightContent={<SwipeToArchiveContent />}
              rightActionActivationDistance={175}
              onRightActionRelease={function () {
                Alert.alert('Confirm', `Do you want to archive ${item.name}?`, [
                  {
                    text: 'Cancel',
                  },
                  {
                    text: 'Archive',
                    onPress: function () {
                      props.archiveCategoryToDb(item.name).catch(function (e) {
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
                    backgroundColor: theme.colors.red,
                    justifyContent: 'center',
                    flex: 1,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: '500',
                      fontSize: 18,
                      color: '#fff',
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
              onLeftActionRelease={function () {
                Alert.alert(
                  'Confirm',
                  `Do you want to un-archive ${item.name}?`,
                  [
                    {
                      text: 'Cancel',
                    },
                    {
                      text: 'Un-Archive',
                      onPress: function () {
                        props
                          .unarchiveCategoryToDb(item.name)
                          .catch(function (e) {
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
                style={[sharedStyles.borderBottom, { paddingVertical: 15 }]}
                onPress={function () {
                  setOldCategory(item.name);
                  setNewCategory(item.name);
                }}
                disabled={item.is_archived}
                accessory={() => {
                  return item.is_archived ? (
                    <Button disabled size="small">
                      Archived
                    </Button>
                  ) : (
                    <View />
                  );
                }}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            </Swipeable>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
