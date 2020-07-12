const Twitter = require('twitter')
const faunadb = require('faunadb')

const faunaClient = new faunadb.Client({
  // secret: process.env.FAUNADB_SERVER_SECRET
  secret: process.env.FAUNA_KEY
})
const q = faunadb.query

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

exports.handler = function(event, context, callback) {
  if (event.httpMethod === 'POST') {
    client.get('search/tweets',
    {
      q: '#函館 -filter:retweets -filter:replies filter:media',
      count: 20,
      include_entities: true,
      tweet_mode: 'extended',
    }, (error, tweets, response) => {
      // const datas = [] // チェック用

      if (error) {
        callback(null, {
          statusCode: 500,
          body: error.toString()
        })
      }

      const tw = tweets.statuses

      for (i=0; i<tw.length; i++) {
        if (tw[i].entities.media && tw[i].extended_entities) {

          // imgs
          const arr = []
          for (j=0; j<tw[i].extended_entities.media.length; j++) {
            arr.push(tw[i].extended_entities.media[j].media_url_https)
          }

          // url
          const user_url = tw[i].extended_entities.media[0].expanded_url.split('/status')[0]

          // video
          const video_info = tw[i].extended_entities.media[0].video_info

          let variants
          if (video_info) {
            variants =  video_info.variants.filter(n => n.content_type === "video/mp4")

            variants.sort((a, b) => {
              if(a.bitrate < b.bitrate) return 1
              if(a.bitrate > b.bitrate) return -1
              return 0
            })
          }

          const tw_data = {
            "created_at": tw[i].created_at,
            "full_text": tw[i].full_text.replace(/\r?\n/g,''),
            "extended_entities": {
              "url": tw[i].extended_entities.media[0].url,
              "media": arr,
              "video": video_info ? variants[0].url : null,
              "width": tw[i].extended_entities.media[0].sizes.small.w,
              "height": tw[i].extended_entities.media[0].sizes.small.h
            },
            "user": {
              "name": tw[i].user.name,
              "screen_name": tw[i].user.screen_name,
              "profile_image_url_https": tw[i].user.profile_image_url_https,
              "url": user_url
            }
          }

          // datas.push(tw_data) // チェック用

          // faunaDB
          faunaClient.query(q.Create(q.Collection("tweet_data"), {
            data: { tw: tw_data }
          }))
          .then((ret) => console.log(ret))
          .catch((ret) => {
            console.log(
              ret.name, 
              ret.message, 
              // ret.requestResult.requestRaw
            )
          })
        }
      }

      callback(null, {
        statusCode: 200,
        body: 'hello'
        // body: JSON.stringify(datas, null, 2)
      })
    })
  }
}
