const AWS = require('aws-sdk')
const request = require('request')
const baseUrl = 'https://api.myfitnesspal.com/public/nutrition'

exports.handler = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ message: '' }),
  }

  const params = event.queryStringParameters

  if (event.headers.token !== 'mti-2021-final') {
    response.statusCode = 401
    response.body = JSON.stringify({
      message: 'Unauthorized',
    })
    callback(null, response)
    return
  }

  if (!params.q) {
    response.statusCode = 400
    response.body = JSON.stringify({
      message: "'q' is required",
    })
    callback(null, response)
    return
  }

  const options = {
    uri: baseUrl,
    qs: {
      q: params.q,
      page: 1,
      per_page: 20,
    },
  }

  request(options, (err, response, body) => {
    //callback
    if (err) {
      response.statusCode = 500
      response.body = JSON.stringify({
        error: err,
      })
      callback(null, response)
      return
    }
    response.body = body
    callback(null, response)
  })
}
