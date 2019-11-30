import queryString from 'query-string';
import { Linking } from 'react-native';

export function createMapUrl({ travelMode, q, latitude, longitude }) {
  const map = {
    q,
    ll: `${latitude},${longitude}`,
    travelmode: travelMode,
    z: 2,
  };

  return `http://maps.apple.com/?${queryString
    .stringify(map)
    .replace(/%2C/g, ',')}`;
}

export function navigateTo(coordinate, q) {
  Linking.openURL(
    createMapUrl({
      travelMode: 'd',
      q,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    })
  );
}
