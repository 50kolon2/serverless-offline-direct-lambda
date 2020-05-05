const serializeError = require('serialize-error');
const path = require('path');

function handler(event, context, callback) {
  const [targetHandlerFile, targetHandlerFunction] = event.targetHandler.split(".");
  const target = require(path.resolve(__dirname, '../..', event.location, targetHandlerFile));

  target[targetHandlerFunction](event.body, context)
    .then((response) => {
      // Return lambda function response to AWS SDK & pass through args from serverless.
      callback(null, response)
    })
    .catch((err) => {
      // Return Serverless error to AWS sdk
      callback(null, {
        FunctionError: 'Unhandled',
        errorType: err.name,
        errorMessage: err.message,
        trace: serializeError(err).stack
      })
    })
}

module.exports.handler = handler;
