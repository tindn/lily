import React from 'react';
import { ScrollView, View, Button, Alert, TextInput } from 'react-native';
import { connect } from 'react-redux';
import theme from '../../theme';
import Pill from '../pill';
import Screen from '../screen';
import sharedStyles from '../sharedStyles';
import MapLocationInput from './mapLocationInput';
import {
  updateDocument,
  deleteDocument,
  addDocument,
} from '../../firebaseHelper';
import { cleanCoordinate } from '../../utils/location';

class VendorDetails extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title:
        params && params.vendorId ? decodeURI(params.vendorId) : 'New Vendor',
    };
  };

  static getDerivedStateFromProps(props, state) {
    if (!state.id && props.vendor) {
      return {
        ...props.vendor,
      };
    }
    return null;
  }

  state = {
    locations: [],
  };

  addLocation = coord => {
    const newLocations = [...this.state.locations];
    newLocations.push(coord);
    this.setState({ locations: newLocations });
  };

  removeLocation = index => {
    const newLocations = [...this.state.locations];
    newLocations.splice(index, 1);
    this.setState({ locations: newLocations });
  };

  updateLocation = (index, coord) => {
    const newLocations = [...this.state.locations];
    newLocations[index] = coord;
    this.setState({ locations: newLocations });
  };

  render() {
    return (
      <Screen style={{ alignContent: 'space-around' }}>
        <ScrollView keyboardShouldPersistTaps="always">
          {!this.state.id && (
            <View
              style={[
                sharedStyles.formRow,
                sharedStyles.borderBottom,
                sharedStyles.formFirstRow,
                { paddingVertical: 20 },
              ]}
            >
              <TextInput
                value={this.state.newId}
                placeholder="Name"
                onChangeText={text => this.setState({ newId: text })}
                style={{ fontSize: 18 }}
                autoFocus={true}
              />
            </View>
          )}
          <View style={{ marginTop: 10, paddingLeft: 20, paddingRight: 80 }}>
            {this.state.locations &&
              this.state.locations.map((location, index) => (
                <MapLocationInput
                  key={index}
                  coord={location}
                  title={decodeURI(this.state.id)}
                  style={[
                    sharedStyles.shadow2,
                    { height: 220, marginBottom: 20 },
                  ]}
                  mapStyle={{ borderRadius: 10 }}
                  removeLocation={() => {
                    this.removeLocation(index);
                  }}
                  updateLocation={e => {
                    this.updateLocation(
                      index,
                      cleanCoordinate(e.nativeEvent.coordinate)
                    );
                  }}
                  markerDraggable={true}
                />
              ))}
          </View>
          <View
            style={{
              paddingLeft: 40,
              paddingRight: 100,
            }}
          >
            <Pill
              onPress={() => {
                // eslint-disable-next-line no-undef
                navigator.geolocation.getCurrentPosition(
                  position => {
                    this.addLocation(cleanCoordinate(position.coords));
                  },
                  null,
                  { enableHighAccuracy: false }
                );
              }}
              label="Add location"
              style={{ padding: 12 }}
              color={theme.colors.secondary}
              backgroundColor={theme.colors.primary}
              textStyle={{ textAlign: 'center' }}
            />
          </View>
          <View style={[{ marginTop: 40 }, sharedStyles.actionButton]}>
            {this.state.id ? (
              <Button
                title="Save"
                onPress={() => {
                  updateDocument('vendors', this.state.id, {
                    locations: this.state.locations,
                  });
                  this.props.navigation.pop();
                }}
              />
            ) : (
              <Button
                title="Add"
                onPress={() => {
                  addDocument(
                    'vendors',
                    { locations: this.state.locations },
                    escape(this.state.newId)
                  );
                  this.props.navigation.pop();
                }}
              />
            )}
          </View>
          {this.state.id && (
            <View style={[sharedStyles.actionButton, { borderBottomWidth: 0 }]}>
              <Button
                title="Delete"
                onPress={() => {
                  Alert.alert(
                    'Confirm',
                    'Do you want to delete this transaction?',
                    [
                      {
                        text: 'Cancel',
                        onPress: function() {},
                      },
                      {
                        text: 'Delete',
                        onPress: () => {
                          deleteDocument('vendors', this.state.id);
                          this.props.navigation.pop();
                        },
                        style: 'destructive',
                      },
                    ]
                  );
                }}
                color={theme.colors.red}
              />
            </View>
          )}
        </ScrollView>
      </Screen>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const vendor = state.vendors[ownProps.navigation.state.params.vendorId];
  return {
    vendor,
  };
}

export default connect(mapStateToProps)(VendorDetails);