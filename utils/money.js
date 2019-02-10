export function formatAmountToDisplay(amount, useParentheses = false) {
  if (!amount) {
    return '$ 00.00';
  }
  if (typeof amount === 'number') {
    amount = amount.toFixed(2);
  }
  let arr = amount.split('');
  let sign = '';
  if (arr[0] === '-') {
    sign = arr.shift();
  }
  // adding thousand (,) separator.
  // this doesn't add the million (or more) separator,
  // as it's unlikely for expenses to be that high.
  if (arr.length > 6) {
    arr.splice(arr.length - 6, 0, ',');
  }

  let display = `$ ${arr.join('')}`;

  if (sign && useParentheses) {
    display = `(${display})`;
  } else {
    display = `${sign}${display}`;
  }

  return display;
}

export function getTotalAmount(transactions) {
  return transactions.reduce((acc, curr) => {
    acc = acc + curr.amount;
    return acc;
  }, 0);
}
