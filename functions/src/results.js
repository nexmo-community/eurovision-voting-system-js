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
    const votes = await mongo.db('eurovision').collection('votes')

    const { country } = event.queryStringParameters

    const topTen = await votes.aggregate([
      { $match: { votersCountry: country } },
      { $group: { _id: '$vote', votes: { $sum: 1 } } },
      { $sort: { votes: -1 } },
      { $limit: 10 }
    ]).toArray()

    const points = [ 12, 10, 8, 7, 6, 5, 4, 3, 2, 1 ]

    const list = await countries.find().toArray()

    const results = topTen.map((votes, i) => {
      const countryRecord = list.find(c => c.iso == votes._id)
      return {
        ...votes,
        points: points[i],
        country: countryRecord.name
      }
    })

    return { headers, statusCode: 200, body: JSON.stringify(results) }
  } catch(e) {
    console.error('Error', e)
    return { headers, statusCode: 500, body: 'Error: ' + e }
  }
}