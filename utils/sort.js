export function by(field, direction, comparator = defaultComparator) {
  return function sort(a, b) {
    if (direction.toLowerCase() === 'asc') {
      return comparator(a[field], b[field]);
    } else {
      return comparator(b[field], a[field]);
    }
  };
}

function defaultComparator(a, b) {
  return a - b;
}
