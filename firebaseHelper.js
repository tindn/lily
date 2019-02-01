import firebase from 'firebase';

export function getCollection(collection) {
  return firebase.firestore().collection(collection);
}

export function getDocument(collection, docId) {
  return getCollection(collection)
  .doc(docId)
    .get()
    .then(function(doc) {
      if (doc.exists) {
        return deserializers[collection + 'Deserialize'](doc);
      }
      return null;
    });
}

export function watchDocument(collection, docId, onChange) {
  return getCollection(collection)
    .doc(docId)
    .onSnapshot(function(doc) {
      if (doc.exists) {
        const data = deserializers[collection + 'Deserialize'](doc);
        if (onChange) {
          onChange(data);
        }
      }
    });
}

export function queryData(collection, queryArgs = []) {
  let query = getCollection(collection);
  queryArgs.forEach(arg => {
    const operator = arg[0];
    const params = arg.slice(1);
    query = query[operator].apply(query, params);
  });
  return query.get().then(transformers[collection + 'FromSnapshot']);
}

export function watchData(collection, queryArgs = [], onChange) {
  let query = getCollection(collection);
  queryArgs.forEach(arg => {
    const operator = arg[0];
    const params = arg.slice(1);
    query = query[operator].apply(query, params);
  });
  return query.onSnapshot(function(snapshot) {
    const data = transformers[collection + 'FromSnapshot'](snapshot);
    if (onChange) {
      onChange(data);
    }
  });
}

export function addDocument(collection, document, docId) {
  document._updatedOn = new Date();
  if (docId) {
    return getCollection(collection)
      .doc(docId)
      .set(document);
  }
  return getCollection(collection).add(document);
}

export function updateDocument(collection, docId, updates) {
  updates._updatedOn = new Date();
  return getCollection(collection)
    .doc(docId)
    .update(updates);
}

export function deleteDocument(collection, docId) {
  return getCollection(collection)
    .doc(docId)
    .delete();
}

const deserializers = {
  monthlyAnalyticsDeserialize,
  transactionsDeserialize,
  electricityReadingsDeserialize,
  accountEntriesDeserialize,
  accountsDeserialize,
  vendorsDeserialize,
};

const transformers = {
  monthlyAnalyticsFromSnapshot,
  transactionsFromSnapshot,
  electricityReadingsFromSnapshot,
  accountEntriesFromSnapshot,
  accountsFromSnapshot,
  vendorsFromSnapshot,
};

function monthlyAnalyticsFromSnapshot(snapshot) {
  let data = {};
  snapshot.forEach(function(doc) {
    data[doc.id] = monthlyAnalyticsDeserialize(doc);
  });
  return data;
}

function monthlyAnalyticsDeserialize(doc) {
  let month = doc.data();
  month.id = doc.id;
  month.startDate = month.startDate.toDate();
  return month;
}

function transactionsFromSnapshot(snapshot) {
  let transactions = [];
  snapshot.forEach(function(doc) {
    transactions.push(transactionsDeserialize(doc));
  });
  return transactions;
}

function transactionsDeserialize(doc) {
  let transaction = doc.data();
  transaction.id = doc.id;
  transaction.date = transaction.date.toDate();
  transaction.isCredit = transaction.entryType === 'credit';
  return transaction;
}

function electricityReadingsFromSnapshot(snapshot) {
  let readings = [];
  snapshot.forEach(function(doc) {
    readings.push(electricityReadingsDeserialize(doc));
  });
  return readings;
}

function electricityReadingsDeserialize(doc) {
  let reading = doc.data();
  reading.id = doc.id;
  if (reading.timestamp) {
    reading.timestamp = reading.timestamp.toDate();
  }
  return reading;
}

function accountEntriesFromSnapshot(snapshot) {
  let data = {};
  snapshot.forEach(function(doc) {
    data[doc.id] = accountEntriesDeserialize(doc);
  });
  return data;
}

function accountEntriesDeserialize(doc) {
  let entry = doc.data();
  entry.id = doc.id;
  entry.date = entry.date.toDate();
  return entry;
}

function accountsFromSnapshot(snapshot) {
  let data = {};
  snapshot.forEach(function(doc) {
    data[doc.id] = accountsDeserialize(doc);
  });
  return data;
}

function accountsDeserialize(doc) {
  let account = doc.data();
  account.id = doc.id;
  return account;
}

function vendorsFromSnapshot(snapshot) {
  let data = {};
  snapshot.forEach(function(doc) {
    data[doc.id] = vendorsDeserialize(doc);
  });
  return data;
}

function vendorsDeserialize(doc) {
  let vendor = doc.data();
  vendor.id = doc.id;
  return vendor;
}
