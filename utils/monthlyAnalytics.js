import firebase from 'firebase';

export function getMonthlyAnalyticsQuery(args) {
  let query = getMonthlyAnalyticsCollection();
  args.forEach(arg => {
    const operator = arg[0];
    const params = arg.slice(1);
    query = query[operator].apply(query, params);
  });
  return query;
}

export function getMonthlyAnalyticsFromSnapshot(snapshot) {
  let data = [];
  snapshot.forEach(function(doc) {
    let month = doc.data();
    month.id = doc.id;
    month.startDate = month.startDate.toDate();
    data.push(month);
  });
  return data;
}

export function getMonthlyAnalyticsCollection() {
  return firebase.firestore().collection('monthlyAnalytics');
}
