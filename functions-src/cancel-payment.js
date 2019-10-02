const config = require('./config');
const axios = require('axios');

const ADMIN_ROLE = 'admin';

exports.handler = function(event, context, callback) {
  const { user } = context.clientContext
  if (event.httpMethod != 'POST') {
    return callback(null, {statusCode: 404, body: '{"error": "Not found"}'});
  }
  if (!user || !user.app_metadata.roles.includes(ADMIN_ROLE)) {
    return callback(null, {statusCode: 401, body: '{"error": "Not authorized"}'});
  }
  const req_body_incoming = JSON.parse(event.body);

  axios.post(`/v2/payments/${req_body_incoming.payment_id}/cancel`)
    .then(response =>
          callback(null, {statusCode: 200, body: JSON.stringify(response.data)}))
    .catch(response =>
           callback(null, {statusCode: 500, body: JSON.stringify(response.data)}));
}
