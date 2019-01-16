import firebase from 'firebase';

export function getTransactionsQuery(args) {
  let query = getTransactionsCollection();
  args.forEach(arg => {
    const operator = arg[0];
    const params = arg.slice(1);
    query = query[operator].apply(query, params);
  });
  return query;
}

export function getTransactionsFromSnapshot(snapshot) {
  let transactions = [];
  snapshot.forEach(function(doc) {
    let transaction = doc.data();
    transaction.id = doc.id;
    transaction.date = transaction.date.toDate();
    transaction.isCredit = transaction.entryType === 'credit';
    transactions.push(transaction);
  });
  return transactions;
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
  return getTransactionsCollection().add({
    date: transaction.date,
    memo: transaction.memo,
    amount: transaction.amount,
    entryType: transaction.isCredit ? 'credit' : 'debit',
    _addedOn: firebase.firestore.FieldValue.serverTimestamp(),
    vendor: transaction.vendor,
  });
}

export function updateTransaction(transaction) {
  const { id, ...updates } = transaction;
  updates.entryType = updates.isCredit ? 'credit' : 'debit';
  updates._updatedOn = firebase.firestore.FieldValue.serverTimestamp();
  return getTransactionsCollection()
    .doc(id)
    .update(updates);
}

export function deleteTransaction(transactionId) {
  return getTransactionsCollection()
    .doc(transactionId)
    .delete();
}
