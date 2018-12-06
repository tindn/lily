import firebase from 'firebase';

export function fetchTransactions(args) {
  let query = getTransactionsCollection();
  args.forEach(arg => {
    const operator = arg[0];
    const params = arg.slice(1);
    query = query[operator].apply(query, params);
  });

  return query.get().then(querySnapshot => {
    let transactions = [];
    querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      let transaction = doc.data();
      transaction.id = doc.id;
      transactions.push(transaction);
    });
    return transactions;
  });
}

export function getTransactionsCollection() {
  return firebase.firestore().collection('transactions');
}

export function getTotalAmount(transactions) {
  return transactions.reduce((acc, curr) => {
    acc = acc + curr.amount;
    return acc;
  }, 0);
}

export function addTransaction(transaction) {
  getTransactionsCollection().add({
    date: transaction.date,
    memo: transaction.memo,
    amount: parseFloat(transaction.amount.substring(2)),
    entryType: transaction.isCredit ? 'credit' : 'debit',
    _addedOn: firebase.firestore.FieldValue.serverTimestamp()
  });
}
