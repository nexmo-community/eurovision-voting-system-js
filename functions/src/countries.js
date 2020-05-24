require('dotenv').config()
const { MongoClient } = require('mongodb')
const mongo = new MongoClient(process.env.DB_URL, { useUnifiedTopology: true })

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type'
}

exports.handler = async (event, context) => {
  try {
    await mongo.connect()
    const countries = await mongo.db('eurovision').collection('countries')
    const list = await countries.find().toArray()
    return { headers, statusCode: 200, body: JSON.stringify(list) }
  } catch(e) {
    console.error('Error', e)
    return { headers, statusCode: 500, body: 'Error: ' + e }
  }
}