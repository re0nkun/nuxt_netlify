<template>
  <v-app>
    <v-app-bar
      app
      flat
      dense
      collapse-on-scroll
      class="brown lighten-3"
    >
      <nuxt-link to="/" class="toolbar-title">
        <v-toolbar-title v-text="title" />
      </nuxt-link>
    </v-app-bar>

    <v-content class="brown lighten-4">
      <v-container fluid class="py-1">
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      title: '#HashTags'
    }
  }
}
</script>

<style scoped>
.toolbar-title {
  color: inherit;
  text-decoration: inherit;
}
</style>
