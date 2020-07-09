<template>
  <div>
    <v-card
      ref="card"
      color="grey lighten-3"
      tile
      class="ma-1 mt-5 card"
    >
      <v-list-item class="pl-1 min-height-0">
        <a :href="tw.user.url" target="_blank" rel="noopener noreferrer">
          <v-list-item-avatar size="24" class="ma-0">
            <v-img :src="tw.user.profile_image_url_https" />
          </v-list-item-avatar>
        </a>

        <v-list-item-content class="ml-1 pa-1">
          <v-list-item-title>
            {{ tw.user.name }}<span class="subtitle-2 font-weight-light pl-2">@{{ tw.user.screen_name }}</span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-card-text class="pa-2">
        <a id="card-link" :href="tw.extended_entities.url" target="_blank" rel="noopener noreferrer">
          <div class="text-truncate">
            {{ tw.full_text }} ({{ tw.created_at }})
          </div>
        </a>
      </v-card-text>

      <v-responsive :aspect-ratio="ratio">
        <div v-if="tw.extended_entities.video">
          <video
            :src="tw.extended_entities.video"
            width="100%"
            height="100%"
            controls
          />
        </div>
        <div v-else-if="tw.extended_entities.media.length < 2">
          <!-- <div v-if="tw.extended_entities.media.length < 2"> -->
          <a id="card-link" :href="tw.extended_entities.url" target="_blank" rel="noopener noreferrer">
            <v-img
              class="img"
              :src="image"
              :aspect-ratio="aspectRatio"
              @error="altSrc"
            />
          </a>
        </div>
        <div v-else>
          <v-carousel
            :show-arrows="false"
            delimiter-icon="mdi-minus"
            height="auto"
          >
            <a id="card-link" :href="tw.extended_entities.url" target="_blank" rel="noopener noreferrer">
              <v-carousel-item
                v-for="(img, i) in imgs"
                :key="i"
                eager
              >
                <v-img
                  :src="img"
                  :aspect-ratio="aspectRatio"
                  @error="altSrc"
                />
              </v-carousel-item>
            </a>
          </v-carousel>
        </div>
      </v-responsive>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    tw: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      image: this.tw.extended_entities.media[0],
      imgs: this.tw.extended_entities.media,
      ratio: `${this.tw.extended_entities.width}/${this.tw.extended_entities.height}`
    }
  },
  computed: {
    // imgHeight () {
    //   return (window.innerWidth / 4) * (this.tw.extended_entities.height / this.tw.extended_entities.width)
    // },
    aspectRatio () {
      return this.tw.extended_entities.width / this.tw.extended_entities.height
    }
  },
  methods: {
    altSrc () {
      this.img = require('~/assets/images/no-image.png')
    }
  }
}
</script>

<style scoped>
.min-height-0 {
  min-height: 0 !important;
}
a#card-link {
  text-decoration: none;
  color:grey;
}
.created_at {
  color: grey;
}
/* .card {
  min-height: 200px;
} */
</style>
