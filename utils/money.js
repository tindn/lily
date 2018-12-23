export function formatAmountToDisplay(amount) {
  if (!amount) {
    return '$ 00.00';
  }
  if (typeof amount === 'number') {
    amount = amount.toFixed(2);
  }
  let arr = amount.split('');
  // adding thousand (,) separator.
  // this doesn't add the million (or more) separator,
  // as it's unlikely for expenses to be that high.
  if (arr.length > 6) {
    arr.splice(arr.length - 6, 0, ',');
  }
  return '$ ' + arr.join('');
}
