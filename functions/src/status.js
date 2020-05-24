const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type'
}

exports.handler = async (event, context) => {
  try {
    return { headers, statusCode: 200, body: 'ok' }
  } catch(e) {
    console.error('Error', e)
    return { headers, statusCode: 500, body: 'Error: ' + e }
  }
}