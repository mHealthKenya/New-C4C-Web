<template>
  <v-container grid-list-lg>
    <v-layout
      row
      wrap
    >

      <v-flex
        xs12
        text-xs-right
      >

        <v-btn
          class="mx-0 font-weight-light "
          color="success"
          @click="$router.push('add-resource')"
        >
          Add A New Resource
        </v-btn>
      </v-flex>

      <v-flex
        v-for="result in results"
        :key="result.id"
        xs12
        sm6
        md6
        lg4>
        <v-card
          class="mx-auto"
          max-width="744"

        >

          <v-img
            src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
            height="200px"
          />

          <v-card-title>
            {{ result.title }}
          </v-card-title>

          <v-card-actions>
            <v-btn
              color="green"
              text>Share</v-btn>

            <v-btn
              color="purple"
              text
            >
              Explore
            </v-btn>

            <v-spacer/>

            <v-btn
              icon
              @click="show = !show"
            >
              <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
          </v-card-actions>

          <v-expand-transition>
            <div v-show="show">
              <v-divider/>

              <v-card-text>
                {{ result.body }}
              </v-card-text>
            </div>
          </v-expand-transition>

        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      results: []
    }
  },
  created () {
    this.getResources()
  },
  methods: {
    getResources () {
      axios.get('resources/cmes')
        .then((resources) => {
          console.log(resources.data)
          this.results = resources.data.data
        })
        .catch(error => console.log(error.message))
    }
  }
}
</script>
