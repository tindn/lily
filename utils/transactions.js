import firebase from 'firebase';

export function fetchTransactions(args) {
  const db = firebase.firestore();
  let query = db.collection('transactions');
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
