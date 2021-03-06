import { Close } from 'components/Icons';
import React from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

function MapLocationInput(props) {
  const {
    zoom,
    coord,
    title,
    pitch,
    heading,
    markerDraggable,
    style,
    mapStyle,
    updateLocation,
    removeLocation,
  } = props;

  return (
    <View style={style}>
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 5,
          top: 5,
          zIndex: 1,
          padding: 10,
        }}
        onPress={() => {
          Alert.alert('Confirm', 'Do you want to delete this location?', [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: function () {},
            },
            {
              text: 'Delete',
              onPress: () => {
                removeLocation && removeLocation();
              },
              style: 'destructive',
            },
          ]);
        }}
      >
        <Close width={30} height={30} color="#3366FF" />
      </TouchableOpacity>

      <MapView
        style={[{ flex: 1 }, mapStyle]}
        camera={{
          center: coord,
          altitude: zoom || 400,
          zoom: zoom || 400,
          pitch: pitch || 0,
          heading: heading || 0,
        }}
        onPress={updateLocation}
      >
        <Marker
          draggable={markerDraggable}
          coordinate={coord}
          title={title}
          onDragEnd={updateLocation}
        />
      </MapView>
    </View>
  );
}

export default MapLocationInput;
