<template>
  <v-daterange
    v-model="range"
    color="green lighten-1"/>
</template>
<script>
import VuetifyDaterangePicker, { VDaterange } from 'vuetify-daterange-picker'

import 'vuetify-daterange-picker/dist/vuetify-daterange-picker.css'
export default {

  data () {
    return {
      range: {}
    }
  }
}
</script>
