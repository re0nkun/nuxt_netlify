<template>
  <div>
    <div v-for="(i, $index) in news" :key="$index">
      {{ i }}
    </div>
    <infinite-loading @infinite="infiniteHandler" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      page: 0,
      news: []
    }
  },
  methods: {
    infiniteHandler ($state) {
      setTimeout(() => {
        // 配列を分割
        const array = [...Array(300).keys()]
        const n = 40
        const arr = array.reduce((acc, c, i) => i % n ? acc : [...acc, array.slice(i, i + n)], [])
        // console.log(arr)

        // 分割した配列をpush
        for (let i = 0; i < arr[this.page].length; i++) {
          this.news.push(arr[this.page][i])
        }

        $state.loaded()
        this.page += 1

        // pushする配列がない
        let arrLength = 0
        for (let i = 0; i < arr.length; i++) {
          arrLength = arrLength + arr[i].length
        }
        if (this.news.length === arrLength) {
          $state.complete()
        }
      }, 1500)
    }
  }
}
</script>
