require('dotenv').config()
const qs = require('querystring');
const Nexmo = require('nexmo');
const { MongoClient } = require('mongodb');

const mongo = new MongoClient(process.env.DB_URL, { useUnifiedTopology: true });

const nexmo = new Nexmo({
  apiKey: process.env.VONAGE_KEY,
  apiSecret: process.env.VONAGE_SECRET,
  applicationId: process.env.VONAGE_APP,
  privateKey: Buffer.from(process.env.VONAGE_PRIVATE_KEY.replace(/\\n/g, "\n"), 'utf-8')
});

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type'
}

exports.handler = async (event, context) => {
  try {
    const { msisdn, to: lvn, text } = qs.parse(event.body)
    const vote = text.toUpperCase().trim()
    
    await mongo.connect()
    const countries = await mongo.db('eurovision').collection('countries')
    const votes = await mongo.db('eurovision').collection('votes')

    const existingVote = await votes.findOne({ msisdn: msisdn })
    const countryInFinal = await countries.findOne({ iso: vote, final: true })
    const votersCountry = await getCountryCodeFromNumber(msisdn)
    const votersCountryCanVote = await countries.findOne({ iso: votersCountry })

    if(existingVote) return await sendMessage(lvn, msisdn, 'You have already voted')
    if(!countryInFinal) return await sendMessage(lvn, msisdn, 'Not a valid option')
    if(!votersCountryCanVote) return await sendMessage(lvn, msisdn, 'Your number is not from a participating country')
    if(votersCountry == vote) return await sendMessage(lvn, msisdn, 'You cannot vote for your own country')

    await votes.insertOne({ msisdn, vote, votersCountry })
    return await sendMessage(lvn, msisdn, 'Thank you for voting!')

  } catch(e) {
    console.error('Error', e)
    return { headers, statusCode: 200, body: 'Error: ' + e }
  }
}

function sendMessage(sender, recipient, text) {
  return new Promise((resolve, reject) => {
    const to = { type: 'sms', number: recipient }
    const from = { type: 'sms', number: sender }
    const message = { content: { type: 'text', text } } 
    nexmo.channel.send(to, from, message, (err, res) => {
      if(err) reject(err)
      resolve({ headers, statusCode: 200, body: 'ok' })
    })
  })
}

function getCountryCodeFromNumber(number) {
  return new Promise((resolve, reject) => {
    nexmo.numberInsight.get({level: 'basic', number}, async (err, res) => {
      if(err) reject(err)
      else resolve(res.country_code_iso3)
    })
  })
}