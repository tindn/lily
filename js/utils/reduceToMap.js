export function reduceToMapById(arr) {
  return arr.reduce(function(acc, i) {
    acc[i.id] = i;
    return acc;
  }, {});
}
