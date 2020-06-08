<template>
  <v-container grid-list-lg>
    <v-layout
      row
      wrap
    >
      <v-card
        fullscreen
        scrollable
        min-width="90%"
      >

        <v-card-title class="headline"> {{ result.title }} </v-card-title>
        <v-list
          v-for="file in result.files"
          :key="file" >
          <v-card-text height="500px"> Download Documents :<a
            :href=" file.link "
            target="_blank" > {{ file.file_name }} </a> </v-card-text>
        </v-list>
        <v-card-text
          height="500px"
          v-html="result.body">{{ result.body }}</v-card-text>

      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {

  data () {
    return {
      result: [],
      results: []
    }
  },
  created () {
    this.getProtocol()
  },

  methods: {
    getProtocol () {
      var id = this.$route.params.id
      axios.get('resources/protocols/details/' + id)
        .then((protocol) => {
          console.log(protocol.data)
          this.result = protocol.data.data
        })
        .catch(error => console.log(error.message))
    }

  }
}
</script>
