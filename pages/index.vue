<template>
  <div>
    <client-only>
      <div v-masonry transition-duration="0" item-selector=".item" class="masonry-container">
        <div
          v-for="(d, index) in datas"
          :key="index"
          v-masonry-tile
          class="item"
        >
          <!-- <p>{{ d.data.tw }}</p> -->
          <tweetCard :tw="d.data.tw" />
        </div>
      </div>
      <infinite-loading @infinite="infiniteHandler" />
    </client-only>
  </div>
</template>

<script>
import faunadb, { query as q } from 'faunadb'
import tweetCard from '~/components/tweetCard'

const faunaClient = new faunadb.Client({
  secret: process.env.FAUNA_KEY
})

export default {
  components: {
    tweetCard
  },
  data () {
    return {
      datas: [],
      after: null
    }
  },
  mounted () {
    if (typeof this.$redrawVueMasonry === 'function') {
      this.$redrawVueMasonry()
    }
  },
  methods: {
    infiniteHandler ($state) {
      setTimeout(() => {
        faunaClient.query(q.Map(
          q.Paginate(
            q.Match(q.Index('sort_tweet_data')),
            {
              size: 15,
              after: this.after
              // after: [q.Ref(q.Collection('tweet_data'), '')]
            }
          ),
          q.Lambda('attr', q.Get(q.Var('attr')))
        )).then((res) => {
          if (res.after) {
            this.datas.push(...res.data)
            $state.loaded()

            // console.log(res.after[0].value)
            this.after = [q.Ref(q.Collection('tweet_data'), res.after[0].value.id)]
          } else {
            this.datas.push(...res.data)
            // $state.loaded()
            $state.complete()
          }
        })
      }, 500)
    }
  }
}
</script>

<style scoped>
.item {
  width: 100%;
  animation: fadeIn 2s ease 0s 1 normal;
}
@media screen and (min-width:600px) {
  .item {
    width: calc(100% / 2 );
  }
}
@media screen and (min-width:960px) {
  .item {
    width: calc(100% / 4 );
  }
}
@keyframes fadeIn {
  0% { opacity: 0 }
  100% { opacity: 1 }
}
</style>
