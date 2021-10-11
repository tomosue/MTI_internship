const AWS = require('aws-sdk')
const moment = require('moment')
const dynamo = new AWS.DynamoDB.DocumentClient()
const tableName = 'Team1UserLog'
const userTableName = 'Team1User'
const mealsData = require('./data.js')

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

async function dbatchWrite(params) {
  try {
    return await dynamo.batchWrite(params).promise()
  } catch (e) {
    console.log(e)
    return false
  }
}

function randInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min //최댓값은 제외, 최솟값은 포함
}

function momentWeek() {
  const start = moment()
    .startOf('day')
    .valueOf()
  const end = moment()
    .startOf('day')
    .add(6, 'days')
    .endOf('day')
    .valueOf()
  return { start, end }
}

async function checkMeals(mealList, reqUser) {
  let meals = {}
  for (meal of mealList) {
    let dayStart = moment(meal.timestamp).startOf('day')
    let dayKey = dayStart.format('YY.MM.DD')
    let dayTimestamp = dayStart.valueOf()
    if (!meals[dayKey]) {
      meals[dayKey] = {
        date: dayKey,
        timestamp: dayTimestamp,
        meals: [meal],
      }
    } else {
      meals[dayKey].meals.push(meal)
    }
  }

  let needKeys = []
  const startFrom = momentWeek().start
  for (var i = 0; i < 7; i++) {
    let startMoment = moment(startFrom)
    needKeys.push(startMoment.add(i, 'days'))
  }

  let addRequire = {}

  for (d of needKeys) {
    let mealsKey = d.format('YY.MM.DD')
    let mealsStamp = d.valueOf()
    if (meals[mealsKey]) {
      let dataN =
        3 - (meals[mealsKey].meals?.length ? meals[mealsKey].meals.length : 0)
      addRequire[mealsStamp] = dataN < 0 ? 0 : dataN
    } else {
      addRequire[mealsStamp] = 3
    }
  }

  let mealsLength = mealsData.length
  let dParams = {
    RequestItems: {
      Team1UserLog: [],
    },
  }

  console.log('ADDREQUIRE =>', addRequire)
  for (const key of Object.keys(addRequire)) {
    for (var i = 0; i < addRequire[key]; i++) {
      let mj = moment(parseInt(key))
        .startOf('day')
        .format('YY.MM.DD')
      let ts
      console.log(meals, 'MJ => ', addRequire)
      if (addRequire[key] > 0 && meals[mj]) {
        console.log(meals, 'MJ => ', mj)
        ts = meals[mj].meals.slice(-1)[0].timestamp + 1
      } else {
        ts = parseInt(key) + i
      }
      let mealData = mealsData[randInt(0, mealsData.length)]
      dParams.RequestItems.Team1UserLog.push({
        PutRequest: {
          Item: {
            userId: reqUser,
            logType: 'meals',
            clear: false,
            timestamp: ts,
            details: mealData,
          },
        },
      })
    }
  }

  if (dParams.RequestItems.Team1UserLog.length > 0) {
    const data = await dbatchWrite(dParams)
    if (!data) {
      return { put: true, result: data }
    } else {
      return { put: true, result: true }
    }
  }

  return { put: false, result: meals }
}

module.exports = { dq, ddel, dget, dput, cyrb53, momentWeek, checkMeals }
