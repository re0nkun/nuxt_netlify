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

exports.handler = async (event, context) => {
  try {
    // GET
    // if (event.httpMethod === 'GET') {
    //   const req = await faunaClient.query(q.Map(
    //     q.Paginate(q.Match(q.Index("ids_sort_by_ref_desc")), { size: 1 }),
    //     q.Lambda("attr", q.Get(q.Var("attr")))
    //   ))

    //   return {
    //     statusCode: 200,
    //     body: JSON.stringify(req.data, null, 2)
    //   }
    // }

    // POST
    if (event.httpMethod === 'POST') {
      // TwitterApi
      const id_str_arr = []

      const searchTweet = async (queryArg, nextResultsMaxIdArg = null) => {

        const searchData = await client.get('search/tweets',
          {
            q: `#${queryArg} -filter:retweets -filter:replies filter:media`,
            count: 100,
            max_id: nextResultsMaxIdArg
          }
        )

        for (item in searchData.statuses) {
          let id_str = searchData.statuses[item].id_str
          id_str_arr.push(id_str)
          console.log(id_str)
        }


        if (searchData.search_metadata == undefined) {
          console.log('---- Complete (no metadata) ----')
          return 0
        }
        else if (searchData.search_metadata.next_results) {
          let maxId = searchData.search_metadata.next_results.match(/\?max_id=(\d*)/)
          // ["?max_id=1273252888689557513", "1273252888689557513"]

          if (maxId[1] == null) {
            return 0
          }

          console.log('---- next:' + maxId[1] + ' ----')
          //ここのawait大事
          await searchTweet(queryArg, maxId[1])
        }
        else {
          console.log('---- Complete ----')
          return 0
        }
      }
      await searchTweet('函館')

      // console.log(id_str_arr)

      // faunaDB
      const req = await faunaClient.query(q.Create(q.Collection("id_strings"), {
        data: {
          date: new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }),
          id_strings: id_str_arr
        }
      }))

      console.log(req)

      return {
        statusCode: 200,
        body: 'post'
      }
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: err.toString()
    }
  }
}

// exports.handler = function(event, context, callback) {
//   client.get('search/tweets',
//   {
//     q: '#10秒グラビア -filter:retweets filter:media',
//     count: 100,
//   },
//   function(error, tweets, response) {
//     if (error) {
//       callback(null, {
//         statusCode: 500,
//         body: error.toString()
//       })
//     }

//     const datas = {"id_str": []}

//     for (i=0; i<tweets.statuses.length; i++) {
//       datas["id_str"].push(tweets.statuses[i].id_str)
//     }

//     callback(null, {
//       statusCode: 200,
//       body: JSON.stringify(datas, null, 2)
//     })
//   })
// }
