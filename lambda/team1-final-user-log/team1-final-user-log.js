const AWS = require('aws-sdk')
const dynamo = new AWS.DynamoDB.DocumentClient()
const tableName = 'Team1UserLog'
const userTableName = 'Team1User'

const cyrb53 = function(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

async function dget(params) {
  try {
    return await dynamo.get(params).promise()
  } catch (e) {
    console.log(e)
    return false
  }
}

async function dput(params) {
  try {
    return await dynamo.put(params).promise()
  } catch (e) {
    console.log(e)
    return false
  }
}

async function ddel(params) {
  try {
    return await dynamo.delete(params).promise()
  } catch (e) {
    console.log(e)
    return false
  }
}

async function dq(params) {
  try {
    return await dynamo.query(params).promise()
  } catch (e) {
    console.log(e)
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

  let dynamoParam = {
    TableName: userTableName,
    Key: {
      userId: requestUser,
    },
  }

  const userInfo = (await dget(dynamoParam))?.Item

  if (!userInfo) {
    response.statusCode = 400
    response.body = JSON.stringify({
      message: 'user not found',
    })
    return callback(null, response)
  }

  if (requestMethod === 'PUT') {
    // PUT Method
    /* 
    request example (JSON)
    {
      userId: testUser,
      logType: 'ate',
      timestamp: ?,
      details: [
        {
          foodName: '',
          intake: (g),
          nutritions: {
            p:~,
            c:~,
            f:~,
          }
        },
      ]
    }
    */
    let dynamoParam = {
      TableName: tableName,
      Item: {
        userId: requestUser,
        logType: requestBody.logType, // has 2 types. ate: ate food log / training: done home training
        clear: false,
        timestamp: requestBody.timestamp ? requestBody.timestamp : Date.now(),
        details: requestBody.details,
      },
    }

    const data = await dput(dynamoParam)
    if (!data) {
      response.statusCode = 500
      response.body = JSON.stringify({
        message: 'Dynamo Error',
      })
      return callback(null, response)
    }
    response.body = JSON.stringify({
      status: 'OK',
      data: dynamoParam.Item,
    })
    return callback(null, response)
  } else if (requestMethod === 'GET') {
    // GET Method

    const timeStart = requestParams.start ? requestParams.start : 0
    const timeEnd = requestParams.end ? requestParams.end : Date.now()
    const logType = requestParams.log_type
    const isCleared = requestParams.is_clear

    let kce = 'userId = :uid AND (#time BETWEEN :from AND :to)' // KeyConditionExpression
    let ean = {
      // ExpressionAttributeNames
      '#time': 'timestamp',
    }
    let eav = {
      // ExpressionAttributeValues
      ':uid': requestUser,
      ':from': parseInt(timeStart),
      ':to': parseInt(timeEnd),
    }

    let filter = ''

    if (isCleared !== undefined) {
      ean['#clear'] = 'clear'
      eav[':isClear'] = isCleared === 'true'
      filter += '#clear = :isClear'
    }

    if (logType) {
      ean['#logtype'] = 'logType'
      eav[':ltype'] = logType
      filter += filter == '' ? '#logtype = :ltype' : ' AND #logtype = :ltype'
    }

    dynamoParam = {
      TableName: tableName,
      KeyConditionExpression: kce,
      FilterExpression: filter,
      ExpressionAttributeNames: ean,
      ExpressionAttributeValues: eav,
    }

    console.log(dynamoParam)

    const data = await dq(dynamoParam)
    if (!data) {
      response.statusCode = 500
      response.body = JSON.stringify({
        message: 'Dynamo ERROR',
      })
      return callback(null, response)
    }

    response.body = JSON.stringify(data.Items)
    return callback(null, response)
  }
}
