<template>
  <div />
</template>

<script>
export default {
  props: {
    tweetId: {
      type: String,
      default: null
    }
  },
  mounted () {
    if (this.tweetId) {
      window.twttr.widgets.createTweet(
        this.tweetId,
        this.$el,
        {}
      ).then((el) => {
        el.shadowRoot.querySelector('.CallToAction').style.display = 'none'
        el.shadowRoot.querySelector('.Tweet-body').style.height = '350px'
        el.shadowRoot.querySelector('.Tweet-body').style.overflow = 'scroll'
        // el.shadowRoot.querySelector('.tweet-InformationCircle').style.display = 'none'
        // el.shadowRoot.querySelector('.EmbeddedTweet-tweet').style.padding = '10px 5px'
        // el.shadowRoot.querySelector('.Tweet-text').style.maxHeight = '80px'
        // el.shadowRoot.querySelector('.Tweet-text').style.overflow = 'auto'
      })
    }
  }
}
</script>
