const config = require('./config');
const axios = require('axios');
const uuid4 = require('uuid/v4');

const WEEKLY_RENTAL_AMOUNT = 100;
const DEPOSIT_AMOUNT = 200;

exports.handler = function(event, context, callback) {
  if (event.httpMethod != 'POST') {
    return callback(null, {statusCode: 404, body: '{"error": "Not found"}'});
  }
  const req_body_incoming = JSON.parse(event.body);
  const amount_money = req_body_incoming.rental_length*WEEKLY_RENTAL_AMOUNT + DEPOSIT_AMOUNT;

  const idempotency_key = uuid4();
  const request_body = {
    source_id: req_body_incoming.nonce,
    amount_money: { amount: amount_money, currency: config.CURRENCY },
    idempotency_key: idempotency_key,
    autocomplete: false
  }
  if ('tip' in req_body_incoming) {
    request_body.tip_money = { amount: req_body_incoming.tip, currency: config.CURRENCY};
  }

  axios.post('/v2/payments', request_body)
    .then(response =>
          callback(null, {statusCode: 200, body: JSON.stringify(response.data)}))
    .catch(response =>
           callback(null, {statusCode: 500, body: JSON.stringify(response.data)}));
}
