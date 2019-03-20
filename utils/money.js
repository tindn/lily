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

export function calculateFinanceOverview(accounts) {
  let totalAssets = 0,
    totalLiabilities = 0,
    liquidAssets = 0,
    shortTermLiabilities = 0;
  accounts.forEach(function(account) {
    switch (account.category) {
      case 'Investments':
      case 'Fixed Assets':
        totalAssets += account.balance;
        break;
      case 'Liquid Assets':
        totalAssets += account.balance;
        liquidAssets += account.balance;
        break;
      case 'Long Term Liabilities':
        totalLiabilities += account.balance;
        break;
      case 'Short Term Liabilities':
        totalLiabilities += account.balance;
        shortTermLiabilities += account.balance;
        break;
      default:
        break;
    }
  });

  return {
    totalAssets,
    totalLiabilities,
    liquidAssets,
    shortTermLiabilities,
  };
}
