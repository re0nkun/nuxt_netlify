<template>
  <div>
    <v-card
      ref="card"
      color="brown lighten-5"
      class="mx-1 my-2"
    >
      <v-list-item class="pl-2 min-height-0">
        <a :href="tw.user.url" target="_blank" rel="noopener noreferrer">
          <v-list-item-avatar size="28" class="ma-0">
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

      <v-card-text class="card-text pa-2">
        <div v-if="fullText" class="full-text brown lighten-5">
          <span @click="toggleFullText">ー</span>
          <a id="card-link" :href="tw.extended_entities.url" target="_blank" rel="noopener noreferrer">
            {{ tw.full_text }} ({{ tw.created_at }})
          </a>
        </div>
        <div class="text-truncate">
          <span @click="toggleFullText">＋</span>
          <a id="card-link" :href="tw.extended_entities.url" target="_blank" rel="noopener noreferrer">
            {{ tw.full_text }} ({{ tw.created_at }})
          </a>
        </div>
      </v-card-text>

      <v-responsive :aspect-ratio="ratio">
        <div v-if="tw.extended_entities.video">
          <video
            :poster="image"
            :src="tw.extended_entities.video"
            preload="none"
            controls
            muted
            playsinline
          />
        </div>
        <div v-else-if="tw.extended_entities.media.length < 2">
          <a id="card-link" :href="tw.extended_entities.url" target="_blank" rel="noopener noreferrer">
            <v-img
              :src="image"
              :aspect-ratio="ratio"
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
                  :aspect-ratio="ratio"
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
      fullText: false
    }
  },
  computed: {
    ratio () {
      return this.tw.extended_entities.width / this.tw.extended_entities.height
    }
  },
  methods: {
    altSrc () {
      this.img = require('~/assets/images/no-image.png')
    },
    toggleFullText () {
      this.fullText = !this.fullText
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
video {
  width: 100%;
  height: auto;
  /* object-fit: cover; */
}
.card-text {
  position: relative;
}
.full-text {
  width: 100%;
  padding: 8px;
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
}
</style>
