<template>
  <div>
    <v-row
      no-gutters
    >
      <v-col
        v-for="id_str in datas"
        :key="id_str"
        cols="3"
        xs12
        sm8
        md6
      >
        <div class="mx-2">
          <!-- {{ id_str }} -->
          <!-- <EmbbedTw :tweet-id="id_str" /> -->
          <Tweet :id="id_str" />
        </div>
      </v-col>
    </v-row>
    <client-only>
      <infinite-loading @infinite="infiniteHandler" />
    </client-only>
  </div>
</template>

<script>
import faunadb, { query as q } from 'faunadb'
// import EmbbedTw from '@/components/Embbed_tw'
import { Tweet } from 'vue-tweet-embed'

const faunaClient = new faunadb.Client({
  secret: process.env.FAUNA_KEY
})

export default {
  components: {
    // EmbbedTw
    Tweet
  },
  async asyncData () {
    try {
      const res = await faunaClient.query(q.Map(
        q.Paginate(q.Match(q.Index('ids_sort_by_ref_desc')), { size: 1 }),
        q.Lambda('attr', q.Get(q.Var('attr')))
      ))
      console.log(res)

      const idStrs = await res.data[0].data.id_strings

      // 配列を分割
      const n = 8
      const splitIdStrs = await idStrs.reduce(
        (acc, c, i) => i % n ? acc : [...acc, idStrs.slice(i, i + n)]
        , []
      )
      return { split_id_strs: splitIdStrs }
    } catch (err) {
      console.log(err)
    }
  },
  data () {
    return {
      page: 0,
      datas: []
      // split_id_strs: null
    }
  },
  // async created () {
  //   const res = await faunaClient.query(q.Map(
  //     q.Paginate(q.Match(q.Index('ids_sort_by_ref_desc')), { size: 1 }),
  //     q.Lambda('attr', q.Get(q.Var('attr')))
  //   ))

  //   const idStrs = await res.data[0].data.id_strings

  //   // 配列を分割
  //   const n = 8
  //   const splitIdStrs = await idStrs.reduce(
  //     (acc, c, i) => i % n ? acc : [...acc, idStrs.slice(i, i + n)]
  //     , []
  //   )

  //   this.split_id_strs = splitIdStrs
  // },
  methods: {
    infiniteHandler ($state) {
      setTimeout(() => {
        const arr = this.split_id_strs

        // 分割した配列をpush
        for (let i = 0; i < arr[this.page].length; i++) {
          this.datas.push(arr[this.page][i])
        }

        $state.loaded()
        this.page += 1

        // pushする配列がない
        let arrLength = 0
        for (let i = 0; i < arr.length; i++) {
          arrLength = arrLength + arr[i].length
        }
        if (this.datas.length === arrLength) {
          $state.complete()
        }
      }, 1000)
    }
  }
}
</script>

<style scoped>
.mx-2 {
  height: 500px;
  overflow: auto;
  animation: fadeIn 3s ease 0s 1 normal;
}
@keyframes fadeIn {
  0% { opacity: 0 }
  100% { opacity: 1 }
}
</style>
