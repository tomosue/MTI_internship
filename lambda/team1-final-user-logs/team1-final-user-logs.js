const tableName = 'Team1UserLog'
const userTableName = 'Team1User'
const {
  dq,
  ddel,
  dget,
  dput,
  cyrb53,
  momentWeek,
  checkMeals,
} = require('./utils.js')

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
  const requestEndpoint = event.rawPath.split('/').slice(-1)[0]

  if (!requestUser || requestToken !== 'mti-2021-final') {
    // check request has userId param and token (required)
    response.statusCode = requestUser ? 401 : 400
    response.body = JSON.stringify({
      message: `'${requestUser ? 'token' : 'userId'}' is required`,
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

  if (requestEndpoint === 'meals' && requestMethod === 'GET') {
    if (requestParams.start && requestParams.end) {
      dynamoParam = {
        TableName: tableName,
        KeyConditionExpression:
          'userId = :uid AND (#time BETWEEN :from AND :to)',
        FilterExpression: '#logtype = :ltype',
        ExpressionAttributeNames: {
          // ExpressionAttributeNames
          '#time': 'timestamp',
          '#logtype': 'logType',
        },
        ExpressionAttributeValues: {
          // ExpressionAttributeValues
          ':uid': requestUser,
          ':from': parseInt(requestParams.start), // for test
          ':to': parseInt(requestParams.end),
          ':ltype': 'meals',
        },
      }
      const seResult = await dq(dynamoParam)
      if (!seResult) {
        response.statusCode = 500
        response.body = JSON.stringify({
          message: 'Dynamo Error',
        })
        return callback(null, response)
      }
      response.body = JSON.stringify({
        data: seResult.Items,
      })
      return callback(null, response)
    }
    const weekTime = momentWeek()

    dynamoParam = {
      TableName: tableName,
      KeyConditionExpression: 'userId = :uid AND (#time BETWEEN :from AND :to)',
      FilterExpression: '#logtype = :ltype',
      ExpressionAttributeNames: {
        // ExpressionAttributeNames
        '#time': 'timestamp',
        '#logtype': 'logType',
      },
      ExpressionAttributeValues: {
        // ExpressionAttributeValues
        ':uid': requestUser,
        ':from': weekTime.start, // for test
        ':to': weekTime.end,
        ':ltype': 'meals',
      },
    }

    const userWeekMeals = await dq(dynamoParam)
    if (!userWeekMeals) {
      response.statusCode = 500
      response.body = JSON.stringify({
        message: 'DynamoError',
      })
      return callback(null, response)
    }
    const meals = await checkMeals(userWeekMeals.Items, requestUser)
    if (!meals.result) {
      response.statusCode = 500
      response.body = JSON.stringify({
        message: 'checkMeals ERROR',
      })
      return callback(null, response)
    }

    let result
    if (meals.put) {
      result = await checkMeals((await dq(dynamoParam)).Items, requestUser)
      response.body = JSON.stringify({
        data: result,
      })
      return callback(null, response)
    } else {
      result = meals.result
      response.body = JSON.stringify({ data: result })
      return callback(null, response)
    }
  } else if (requestEndpoint === 'meals' && requestMethod === 'PUT') {
    const mealsRequired = ['userId', 'timestamp', 'clear', 'details']
    for (f of mealsRequired) {
      if (requestBody[f] !== undefined) {
        response.statusCode = 400
        response.body = JSON.stringify({
          message: `${f} is required`,
        })
        return callback(null, response)
      }
    }
    dynamoParam = {
      TableName: tableName,
      Item: {
        userId: requestUser,
        timestamp: requestBody.timestamp,
        clear: requestBody.clear,
        details: requestBody.details,
        logType: 'meals',
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
      message: 'Success',
    })
    return callback(null, response)
  } else if (requestEndpoint === 'workout' && requestMethod === 'PUT') {
    const workoutRequired = ['userId', 'timestamp', 'clear', 'details']
    for (f of workoutRequired) {
      if (requestBody[f] !== undefined) {
        response.statusCode = 400
        response.body = JSON.stringify({
          message: `${f} is required`,
        })
        return callback(null, response)
      }
    }
    dynamoParam = {
      TableName: tableName,
      Item: {
        userId: requestUser,
        timestamp: requestBody.timestamp,
        clear: requestBody.clear,
        details: requestBody.details,
        logType: 'workout',
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
      message: 'Success',
    })
    return callback(null, response)
  } else if (requestEndpoint === 'workout' && requestMethod === 'GET') {
    dynamoParam = {
      TableName: tableName,
      KeyConditionExpression: 'userId = :uid AND (#time BETWEEN :from AND :to)',
      FilterExpression: '#logtype = :ltype',
      ExpressionAttributeNames: {
        // ExpressionAttributeNames
        '#time': 'timestamp',
        '#logtype': 'logType',
      },
      ExpressionAttributeValues: {
        // ExpressionAttributeValues
        ':uid': requestUser,
        ':from': requestParams.start ? parseInt(requestParams.start) : 0, // for test
        ':to': requestParams.end ? parseInt(requestParams.end) : Date.now(),
        ':ltype': 'workout',
      },
    }
    const result = await dq(dynamoParam)
    if (!result) {
      response.statusCode = 500
      response.body = JSON.stringify({
        message: 'Dynamo Error',
      })
      return callback(null, response)
    }
    response.body = JSON.stringify({
      data: result.Items,
    })
    return callback(null, response)
  }
  return requestEndpoint
}
//1630885795200
//1630281600000
