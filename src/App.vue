<template>
  <v-app>
    <div
      v-if="this.$route.path !== '/login'">
      <core-toolbar />

      <core-drawer />
    </div>
    <core-view />

  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  }
}

</script>

<style lang="scss">
@import 'styles/index.scss';

/* Remove in 1.2 */
.v-datatable thead th.column.sortable i {
  vertical-align: unset;
}
</style>
