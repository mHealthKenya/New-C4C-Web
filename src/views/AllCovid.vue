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
          @click="$router.push('new_covid19_resources')">

          Add A New COVID 19 Resource
        </v-btn>

      </v-flex>

      <v-snackbar
        color="error"
        v-model="snackbar"
        :timeout="12000"
        top>
        <v-icon
        color="white"
        class="mr-3"
      >
        mdi-bell-plus
      </v-icon>
      <div> {{output.message}} {{ output.errors }} {{resp}}</div>
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
      cols="12" 
      dense 
      v-else
      v-for="(result, index) in results"
      :key="result.id"
      dark>

        <v-card 
        class="mx-auto"
        outlined>

            <div class="d-flex flex-no-wrap justify-space-between">
              <v-img
              height="150px"
              max-width="200px"
              :src="result.file || 'sunshine.jpg' "
              class="white--text align-end"
              
            />
             
              <v-list >
              <v-card-title class="headline"> {{ result.title }} </v-card-title>

              <v-card-actions>
                <v-card-text class="text--primary">
                <div><span> Created On: </span> {{ result.created_at }}</div>
              </v-card-text>

              <v-btn icon
                color="orange"
                @click="$router.push({ name: 'View COVID19 Resource', params: {id: result.id} })">
                <v-icon> mdi-plus  </v-icon>
              </v-btn>

              <v-btn icon
              color="green"
              @click="$router.push({ name : 'Edit COVID19 Resource', params: {id: result.id } })">
              <v-icon> mdi-pencil </v-icon>
            </v-btn>

            <v-btn icon
              color="red"
              @click=" deleteResource(result.id, index); loading=true ">
              <v-icon> mdi-delete </v-icon>
            </v-btn>

            </v-card-actions>              
          </v-list>

          </div>
          </v-card>
      
      </v-flex>
    </v-layout>

    <v-layout
      row
      wrap
      v-else>

      <v-flex
        xs12
        text-xs-right>

      </v-flex>

      <v-snackbar
        color="error"
        v-model="snackbar"
        :timeout="12000"
        top>
        <v-icon
        color="white"
        class="mr-3"
      >
        mdi-bell-plus
      </v-icon>
      <div> {{output.message}} {{ output.errors }} {{resp}}</div>
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
      cols="12" 
      dense 
      v-else
      v-for="(result) in results"
      :key="result.id"
      dark>

        <v-card 
        class="mx-auto"
        outlined>

            <div class="d-flex flex-no-wrap justify-space-between">
              <v-img
              height="150px"
              max-width="200px"
              :src="result.file || 'sunshine.jpg' "
              class="white--text align-end"
              
            />
             
              <v-list >
              <v-card-title class="headline"> {{ result.title }} </v-card-title>

              <v-card-actions>
                <v-card-text class="text--primary">
                <div><span> Created On: </span> {{ result.created_at }}</div>
              </v-card-text>

              <v-btn
                color="orange"
                @click="$router.push({ name: 'View COVID19 Resource', params: {id: result.id} })">
                Read More
              </v-btn>

            </v-card-actions>              
          </v-list>

          </div>
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
  components: {Loader},

  data () {
    return {
      results: [],
      snackbar: false,
      output: '',
      role_id: '',
      resp: '',
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

      axios.get('resources/special')
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

    deleteResource(id, index)  {

    axios.delete('resources/special/delete/' +id)
      .then((response) => {
      // this.result.splice(index, 1)
        console.log(response.data) 

        this.loading = false

        this.results.splice(index, 1)

        this.resp = 'Deleted Successfully'
          
        this.snackbar = true
      })
      .catch((error) => {
        this.error = true
        console.log(error)
        this.result = 'Failed, please try again'
        this.snackbar = true
      })

    }
  }
}
</script>

<style >
.v-card { margin: 20px; }

</style>
