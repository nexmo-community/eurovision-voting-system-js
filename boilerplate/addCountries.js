require('dotenv').config()
const { MongoClient } = require('mongodb')
const mongo = new MongoClient(process.env.DB_URL, { useUnifiedTopology: true })

const countriesList = [
  { "iso": "ALB", "name": "Albania", "final": true },
  { "iso": "ARM", "name": "Armenia", "final": false },
  { "iso": "AUS", "name": "Australia", "final": true },
  { "iso": "AUT", "name": "Austria", "final": false },
  { "iso": "AZE", "name": "Azerbaijan", "final": true },
  { "iso": "BLR", "name": "Belarus", "final": true },
  { "iso": "BEL", "name": "Belgium", "final": false },
  { "iso": "HRV", "name": "Croatia", "final": false },
  { "iso": "CYP", "name": "Cyprus", "final": true },
  { "iso": "CZE", "name": "Czech Republic", "final": true },
  { "iso": "DNK", "name": "Denmark", "final": true },
  { "iso": "EST", "name": "Estonia", "final": true },
  { "iso": "FIN", "name": "Finland", "final": false },
  { "iso": "FRA", "name": "France", "final": true },
  { "iso": "DEU", "name": "Germany", "final": true },
  { "iso": "GEO", "name": "Georgia", "final": false },
  { "iso": "GRC", "name": "Greece", "final": true },
  { "iso": "HUN", "name": "Hungary", "final": false },
  { "iso": "ISL", "name": "Iceland", "final": true },
  { "iso": "IRL", "name": "Ireland", "final": false },
  { "iso": "ISR", "name": "Israel", "final": true },
  { "iso": "ITA", "name": "Italy", "final": true },
  { "iso": "LVA", "name": "Latvia", "final": false },
  { "iso": "LTU", "name": "Lithuania", "final": false },
  { "iso": "MKD", "name": "North Macedonia", "final": true },
  { "iso": "MLT", "name": "Malta", "final": true },
  { "iso": "MDA", "name": "Moldova", "final": false },
  { "iso": "MNE", "name": "Montenegro", "final": false },
  { "iso": "NLD", "name": "Netherlands", "final": true },
  { "iso": "NOR", "name": "Norway", "final": true },
  { "iso": "POL", "name": "Poland", "final": false },
  { "iso": "PRT", "name": "Portugal", "final": false },
  { "iso": "ROU", "name": "Romania", "final": false },
  { "iso": "RUS", "name": "Russia", "final": true },
  { "iso": "SMR", "name": "San Marino", "final": true },
  { "iso": "SRB", "name": "Serbia", "final": true },
  { "iso": "SVN", "name": "Slovenia", "final": true },
  { "iso": "ESP", "name": "Spain", "final": true },
  { "iso": "SWE", "name": "Sweden", "final": true },
  { "iso": "CHE", "name": "Switzerland", "final": true },
  { "iso": "UKR", "name": "Ukraine", "final": false },
  { "iso": "GBR", "name": "United Kingdom", "final": true }
]

mongo.connect().then(async () => {
  try {
    const countries = await mongo.db('eurovision').collection('countries')
    const result = await countries.insertMany(countriesList)
    console.log(`Added ${result.insertedCount} documents to the collection`)
    mongo.close()
  } catch(e) {
    console.error(e)
  }
})