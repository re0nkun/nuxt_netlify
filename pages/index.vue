<template>
  <div>
    <v-container fluid>
      <v-row
        no-gutters
      >
        <v-col
          v-for="(str, index) in datas"
          :key="index"
          cols="3"
        >
          <v-card class="ma-1 pa-1">
            {{ str }}
            <!-- <Tweet :id="status.id_str" /></Tweet> -->
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import faunadb, { query as q } from 'faunadb'
// import { Tweet } from 'vue-tweet-embed'

const faunaClient = new faunadb.Client({
  secret: process.env.FAUNA_KEY
})

export default {
  components: {
    // Tweet
  },
  data () {
    return {
      datas: null
    }
  },
  created () {
    faunaClient.query(q.Map(
      q.Paginate(q.Match(q.Index('ids_sort_by_ref_desc')), { size: 1 }),
      q.Lambda('attr', q.Get(q.Var('attr')))
    ))
      .then((res) => {
        const idStrs = res.data[0].data.id_strings
        // 配列を分割
        const n = 8
        const splitIdStrs = idStrs.reduce(
          (acc, c, i) => i % n ? acc : [...acc, idStrs.slice(i, i + n)]
          , []
        )
        this.datas = splitIdStrs
      })
    // console.log(this.datas)
  }
}
</script>
