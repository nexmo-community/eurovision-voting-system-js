require('dotenv').config()
const { MongoClient } = require('mongodb')
const mongo = new MongoClient(process.env.DB_URL, { useUnifiedTopology: true })

mongo.connect().then(async () => {
  try {
    const countries = await mongo.db('eurovision').collection('countries')
    const votes = await mongo.db('eurovision').collection('votes')
    const list = await countries.find().toArray()

    const votesList = []
    for(let i=0; i<20000; i++) {
      const { iso: votersCountry } = list[Math.floor(Math.random() * list.length)]
      const availableCountries = list.filter(c => c != votersCountry && c.final)
      const { iso: vote } = availableCountries[Math.floor(Math.random() * availableCountries.length)]

      votesList.push({
        msisdn: String(Math.ceil(Math.random() * 100000)),
        votersCountry, vote
      })
    }
    
    const result = await votes.insertMany(votesList)
    console.log(`Added ${result.insertedCount} documents to the collection`)
    mongo.close()
  } catch(e) {
    console.error(e)
  }
})