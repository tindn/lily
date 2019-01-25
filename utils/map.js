import queryString from 'query-string';

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
