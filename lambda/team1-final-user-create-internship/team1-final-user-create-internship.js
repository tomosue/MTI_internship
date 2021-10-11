const AWS = require('aws-sdk')
const dynamo = new AWS.DynamoDB.DocumentClient()
const tableName = 'Team1User'

exports.handler = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ message: '' }),
  }

  const body = JSON.parse(event.body)

  const registerFields = [
    'userId',
    'password',
    'nickName',
    'age',
    'weight',
    'height',
    'sex',
  ]

  const param = {
    TableName: tableName,
    Item: {},
  }

  for (const field of registerFields) {
    if (!body[field]) {
      response.statusCode = 400
      response.body = JSON.stringify({
        message: `${field} is required`,
      })
      callback(null, response)
      return
    } else {
      param.Item[field] = body[field]
    }
  }

  //dynamo.put()でDBにデータを登録
  dynamo.put(param, function(err, data) {
    if (err) {
      response.statusCode = 500
      response.body = JSON.stringify({
        message: '予期せぬエラーが発生しました',
      })
      callback(null, response)
      return
    } else {
      //TODO: 登録に成功した場合の処理を記述
      response.body = JSON.stringify({
        message: '成功',
        token: 'mti-2021-final',
      })
      callback(null, response)
    }
  })
}
