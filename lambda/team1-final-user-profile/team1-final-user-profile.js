const AWS = require('aws-sdk')
const dynamo = new AWS.DynamoDB.DocumentClient()
const tableName = 'Team1User'

async function dget(params) {
  try {
    return await dynamo.get(params).promise()
  } catch (e) {
    return false
  }
}

async function dput(params) {
  try {
    return await dynamo.put(params).promise()
  } catch (e) {
    return false
  }
}

async function ddel(params) {
  try {
    return await dynamo.delete(params).promise()
  } catch (e) {
    return false
  }
}

exports.handler = async (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ message: '' }),
  }

  const requestContext = event.requestContext
  const requestMethod = requestContext.http.method
  const requestToken = event.headers.token
  const requestParams = event.queryStringParameters
  const requestBody = JSON.parse(event.body ? event.body : '{}')
  const requestUser =
    requestParams?.userId === undefined
      ? requestBody.userId
      : requestParams.userId

  let dynamoParam = {
    TableName: tableName,
    Key: {
      userId: requestUser,
    },
  }

  if (!requestUser) {
    // check request has userId param (required)
    response.statusCode = 400
    response.body = JSON.stringify({
      message: "'userId' is required",
    })
    callback(null, response)
    return
  }

  if (requestToken !== 'mti-2021-final') {
    response.statusCode = 401
    response.body = JSON.stringify({
      message: 'Unauthorized',
    })
    callback(null, response)
    return
  }

  const userInfo = (await dget(dynamoParam))?.Item

  if (!userInfo) {
    response.statusCode = 400
    response.body = JSON.stringify({
      message: 'user not found',
    })
    return callback(null, response)
  }

  if (requestMethod === 'GET') {
    // GET Method
    response.body = JSON.stringify({
      data: userInfo,
    })
    return callback(null, response)
  } else if (requestMethod === 'PUT') {
    // PUT Method
    const requiredFields = [
      'userId',
      'password',
      'nickName',
      'age',
      'weight',
      'height',
      'sex',
    ]
    let dynamoParam = {
      TableName: tableName,
      Item: {},
    }
    for (const field of requiredFields) {
      if (!requestBody[field]) {
        response.statusCode = 400
        response.body = JSON.stringify({
          message: `'${field}' is required`,
        })
        return callback(null, response)
      } else {
        dynamoParam.Item[field] = requestBody[field]
      }
    }

    if (userInfo.password === requestBody.password) {
      const data = await dput(dynamoParam)
      if (!data) {
        response.statusCode = 500
        response.body = JSON.stringify({
          message: 'Dynamo Error',
        })
      } else {
        response.body = JSON.stringify(dynamoParam.Item)
      }
      return callback(null, response)
    } else {
      response.statusCode = 400
      response.body = JSON.stringify({
        message: 'password not match!',
      })
      return callback(null, response)
    }
  }
}
