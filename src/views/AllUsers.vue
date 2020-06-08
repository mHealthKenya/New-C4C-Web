<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-layout
      justify-center
      wrap
    >

      <v-flex
        md12
      >

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
      <div> {{result}}</div>
      <v-icon
        size="16"
        @click="snackbar = false"
      >
        mdi-close-circle
      </v-icon>
      </v-snackbar>

        <v-card>
          <v-card-title>
            All Users
            <v-spacer/>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            />

            <v-flex
              xs12
              md2>
              <v-btn
                :loading="downloadLoading"
                color="primary"
                @click="handleDownload">
                <v-icon left>mdi-download</v-icon>Export Excel
              </v-btn>
            </v-flex>


          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="all_users"
            :loading="true"
            class="elevation-1"
            :search="search"
            :rows-per-page-items="rowsPerPageItems"
            item-key="id"
          >

          <template slot='no-data'>
              <v-progress-linear slot='progress' indeterminate></v-progress-linear>
          </template>
                
          <template slot="items" slot-scope="props">
            <td>{{ props.item.id }}</td>
            <td>{{ props.item.county }}</td>
            <td>{{ props.item.sub_county }}</td>
            <td>{{ props.item.role.name }}</td>
            <td>{{ props.item.cadre }}</td>
            <td>{{ props.item.gender }}</td>

          </template>
            <v-alert
              slot="no-results"
              :value="true"
              color="success"
              icon="mdi-emoticon-sad">
              Your search for "{{ search }}" found no results.
            </v-alert>

          </v-data-table>

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
      rowsPerPageItems: [500, 5000, 10000],
      search: '',
      isLoading: true,
      all_users: [],
      snackbar: false,
      result: '',

      downloadLoading: false,
      filename: `Users ${new Date().toISOString()}`,
      autoWidth: true,
      bookType: 'xlsx',

      headers: [
        {
          sortable: true,
          text: 'ID',
          value: 'id'
        },
        {
          sortable: false,
          text: 'County',
          value: 'county'
        },
          {
            sortable: false,
            text: 'Sub County',
            value: 'sub_county'
          },
        {
          sortable: true,
          text: 'Role',
          value: 'role_name'
        },
      
        {
          sortable: false,
          text: 'Cadre',
          value: 'cadre'
        },
        {
          sortable: false,
          text: 'Gender',
          value: 'gender'
        }
      ]
    }
  },
  created () {
    this.getUsers()
  },
  methods: {

    getUsers () {
      axios.get('users')
        .then((users) => {
          console.log(users.data)
          this.all_users = users.data.data
          this.loopT(users.data.links.next)
          this.isLoading = false
        })
        .catch(() => {
          this.error = true
          this.result = 'Check your internet connection or retry logging in.'
          this.snackbar = true

        })
    },
    async loopT (l) {
      var i
      for (i = 0; i < 1;) {
        if (l != null) {
          let response = await axios.get(l)
          l = response.data.links.next
          this.all_users = this.all_users.concat(response.data.data)
        } else {
          i = 11
        }
      } 
    },

    handleDownload () {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', 'County', 'Sub County', 'Role', 'Cadre','Gender']
        const filterVal = ['id', 'county', 'sub_county', 'role_id', 'cadre', 'gender']
        const list = this.all_users
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'cadre') {
          return v[j]
        } else {
          return v[j]
        }
      }))
    }  

    
    
    }
  }

</script>
