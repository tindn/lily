function between(min, val, max) {
  return val >= min && val <= max;
}

function isInRange(current, next, step) {
  return between(next - step, current, next + step);
}

export function isNearby(current, location) {
  if (
    !current.longitude ||
    !current.latitude ||
    !location.longitude ||
    !location.latitude
  ) {
    return false;
  }
  const currentLatitude = parseFloat(current.latitude.toFixed(3));
  const currentLongitude = parseFloat(current.longitude.toFixed(3));
  const locationLatitude = parseFloat(location.latitude.toFixed(3));
  const locationLongitude = parseFloat(location.longitude.toFixed(3));
  return (
    isInRange(currentLatitude, locationLatitude, 0.001) &&
    isInRange(currentLongitude, locationLongitude, 0.001)
  );
}

export function cleanCoordinate(coordinate, decimal = 4) {
  return {
    latitude: parseFloat(coordinate.latitude.toFixed(decimal)),
    longitude: parseFloat(coordinate.longitude.toFixed(decimal)),
  };
}
