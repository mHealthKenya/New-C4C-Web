<template>
  <v-footer
    v-if="this.$route.path !== '/login'"
    id="core-footer"
    absolute
    height="82"
  >
    <div class="footer-items">
      <span
        v-for="link in links"
        :key="link.name"
      >
        <a
          :href="link.Link"
          class="tertiary--text footer-links">{{ link.name }}</a>
      </span>
    </div>

    <v-spacer/>
    <span class="font-weight-light copyright">
      &copy;
      {{ (new Date()).getFullYear() }}
      <a
        href="https://www.mhealthkenya.org/"
        target="_blank">m-Health Kenya </a>
    </span>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    links: [
      { name: 'Home', Link: '/' },
      { name: 'About Us', Link: 'https://www.mhealthkenya.org/why-choose-us' },
      { name: 'Publication', Link: 'https://www.mhealthkenya.org/news-publications' }
    ]
  })
}
</script>

<style>
#core-footer {
  z-index: 0;
}
</style>
