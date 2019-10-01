const uuid4 = require('uuid/v4');
const axios = require('axios');

const ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const BASE_PATH = process.env.SQUARE_BASE_PATH;

exports.handler = function(event, context, callback) {
  if (event.httpMethod != 'POST') {
    return callback(null, {statusCode: 404, body: '{"error": "Not found"}'});
  }
  const idempotency_key = uuid4();
  const request_body = {
    source_id: JSON.parse(event.body).nonce,
    amount_money: { amount: 100, currency: 'USD' },
    idempotency_key: idempotency_key,
    autocomplete: false
  }

  axios.post(BASE_PATH + '/v2/payments', request_body, {
    headers: {'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + ACCESS_TOKEN}
  })
    .then(response =>
          callback(null, {statusCode: 200, body: JSON.stringify(response.data)}))
    .catch(response =>
           callback(null, {statusCode: 500, body: JSON.stringify(response.data)}));
}