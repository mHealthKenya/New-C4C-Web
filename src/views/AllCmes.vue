<template>
  <v-container grid-list-lg>
    <v-layout
      row
      wrap
      v-if="user.role_id === 1 || user.role_id === 2">

      <v-flex
        xs12
        text-xs-right>

        <v-btn
          class="mx-0 font-weight-light "
          color="success"
          @click="$router.push('add_CME')">
          Add A New Public Resource
        </v-btn>

      </v-flex>

      <v-snackbar
        v-model="snackbar"
        :timeout="12000"
        color="error"
        top>
        <v-icon
          color="white"
          class="mr-3"
        >
          mdi-bell-plus
        </v-icon>
        <div> {{ output.errors }} {{ resp }}</div>
        <v-icon
          size="16"
          @click="snackbar = false"
        >
          mdi-close-circle
        </v-icon>
      </v-snackbar>

      <v-flex v-if="loading">
        <Loader />
      </v-flex>

      <v-flex 
        v-for="(result, index) in results"
        :key="result.id"
        xs12
        sm6
        md6
        lg4>

        <v-card
          class="mx-auto"
          max-width="400"

        >
          <v-img
            :src="result.file || 'sunshine.jpg' "
            class="white--text align-end"
            height="200px"
          />

          <v-card-title>{{ result.title }}</v-card-title>

          <v-card-text class="text--primary">
            <div><span>Created On: </span>{{ result.created_at }}</div>
          </v-card-text>

          <v-card-actions>
            <v-btn
              icon
              color="orange"
              @click="$router.push({ name : 'View Public Resource', params: {id: result.id } })">
              <v-icon > mdi-plus </v-icon>
            </v-btn>

            <v-btn
              icon
              color="green"
              @click="$router.push({ name : 'Edit Public Resource', params: {id: result.id } })">
              <v-icon > mdi-pencil </v-icon>
            </v-btn>

            <v-btn
              icon
              color="red"
              @click=" deleteResource(result.id, index); loading=true ">
              <v-icon > mdi-delete </v-icon>
            </v-btn>

          </v-card-actions>

        </v-card>
      </v-flex>
    </v-layout>

    <v-layout
      row
      wrap
      v-else>

      <v-snackbar
        v-model="snackbar"
        :timeout="12000"
        color="error"
        top>
        <v-icon
          color="white"
          class="mr-3"
        >
          mdi-bell-plus
        </v-icon>
        <div> {{ output.errors }} {{ resp }}</div>
        <v-icon
          size="16"
          @click="snackbar = false"
        >
          mdi-close-circle
        </v-icon>
      </v-snackbar>

      <v-flex v-if="loading">
        <Loader />
      </v-flex>

      <v-flex 
        v-for="(result) in results"
        :key="result.id"
        xs12
        sm6
        md6
        lg4>

        <v-card
          class="mx-auto"
          max-width="400"

        >
          <v-img
            :src="result.file || 'sunshine.jpg' "
            class="white--text align-end"
            height="200px"
          />

          <v-card-title>{{ result.title }}</v-card-title>

          <v-card-text class="text--primary">
            <div><span>Created On: </span>{{ result.created_at }}</div>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="orange"
              :style="{left: '50%', transform:'translateX(-50%)'}"
              @click="$router.push({ name : 'View Public Resource', params: {id: result.id } })">
              Read More
            </v-btn>

          </v-card-actions>

        </v-card>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import axios from 'axios'
import Loader from '../components/core/Loader'
import { mapGetters } from 'vuex'

export default {
  components: { Loader },

  data () {
    return {
      results: [],
      snackbar: false,
      output: '',
      resp: '',
      role_id: '',
      loading: true
    }
  },
  created () {
    this.getResources()
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },

  methods: {
    getResources () {
      axios.get('resources/cmes')
        .then((resources) => {
          console.log(resources.data)
          this.results = resources.data.data
          this.loading = false
        })
        .catch(() => {
          this.error = true
          this.resp = 'Check your internet connection or retry logging in.'
          this.snackbar = true
          this.loading = false
        })
    },

    deleteResource (id, index) { 
      axios.delete('resources/cmes/delete/' +id)
        .then((response) => {
          console.log(response.data)

         this.results.splice(index, 1) 

          this.loading = false

          this.resp = 'Deleted Successfully'

          this.snackbar = true
        })
        .catch((error) => {
          this.error = true
          console.log(error)
          this.resp = 'Failed, please try again'
          this.snackbar = false
        })
    }
  }
}
</script>
