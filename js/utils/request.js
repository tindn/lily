export default async function request() {
  var response = await fetch.apply(null, arguments);
  if (response.headers.map['content-type'].startsWith('application/json')) {
    response.body = await response.json();
  }
  if (response.status !== 200) {
    throw response.body;
  } else {
    return response.body;
  }
}
