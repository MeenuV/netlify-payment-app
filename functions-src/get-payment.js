const axios = require('axios');
const config = require('./config');
const faunadb = require('faunadb');
const q = faunadb.query;
const db_client = new faunadb.Client({
  secret: process.env.FAUNADB_ACCESS_KEY
});

exports.handler = function(event, context, callback) {
  const { user } = context.clientContext
  if (event.httpMethod != 'GET') {
    return callback(null, {statusCode: 404, body: '{"error": "Not found"}'});
  }
  const query_params = event.queryStringParameters;
  const payment_id = query_params.payment_id;

  axios.get(`/v2/payments/${payment_id}`)
    .then(response => db_client.query(q.Get(q.Match(q.Index("by_payment_id"), payment_id)))
          .then(db_rsp => Object.assign({}, response.data, db_rsp.data))
          .catch(db_err => response.data))
    .then(data =>
          callback(null, {statusCode: 200, body: JSON.stringify(data)}))
    .catch(response =>
           callback(null, {statusCode: 500, body: JSON.stringify(response.data)}));
}
