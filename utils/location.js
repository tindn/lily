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
  current.latitude = parseFloat(current.latitude.toFixed(3));
  current.longitude = parseFloat(current.longitude.toFixed(3));
  location.latitude = parseFloat(location.latitude.toFixed(3));
  location.longitude = parseFloat(location.longitude.toFixed(3));
  return (
    isInRange(current.latitude, location.latitude, 0.001) &&
    isInRange(current.longitude, location.longitude, 0.001)
  );
}

export function cleanCoordinate(coordinate, decimal = 4) {
  return {
    latitude: parseFloat(coordinate.latitude.toFixed(decimal)),
    longitude: parseFloat(coordinate.longitude.toFixed(decimal)),
  };
}
