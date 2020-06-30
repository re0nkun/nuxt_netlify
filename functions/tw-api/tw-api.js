const Twitter = require('twitter')
var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

exports.handler = function(event, context, callback) {
  client.get('search/tweets',
  {
    q: '#10秒グラビア -filter:retweets filter:media',
    count: 100,
  },
  function(error, tweets, response) {
    if (error) {
      callback(null, {
        statusCode: 500,
        body: error.toString()
      })
    }

    const datas = {"id_str": []}

    for (i=0; i<tweets.statuses.length; i++) {
      datas["id_str"].push(tweets.statuses[i].id_str)
    }

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(datas, null, 2)
    })
  })
}
