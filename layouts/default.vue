<template>
  <v-app>
    <v-app-bar
      app
      dark
      flat
      dense
      collapse-on-scroll
    >
      <nuxt-link to="/" class="toolbar-title">
        <v-toolbar-title v-text="title" />
      </nuxt-link>
    </v-app-bar>

    <v-content>
      <v-container fluid class="py-0">
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
