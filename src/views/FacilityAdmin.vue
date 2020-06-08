<template>
  <v-container
    fill-height
    fluid
    grid-list-xl>
    <v-layout
      justify-center
      wrap
    >
      <v-flex
        xs12
        md11
      >
        <material-card>
          <v-card-text>
            <div/>
            <p class="display-1 text--primary">
              Add A New Admin
            </p>
            <div class="text--primary">
              Kindly fill all the required fields
            </div>
          </v-card-text>
          <v-form @submit="AddAdmin">
            <v-container py-0>
              <v-layout wrap>
                <v-flex
                  xs12
                  md6
                >
                  <v-combobox
                    v-model="facility_id"
                    :rules="[rules.required]"
                    :items="facilities"
                    item-value=""
                    label="Facility"
                    class="purple-input"
                    :loading="load"
                  />
                </v-flex>
                <v-flex
                  xs12
                  md6
                >
                  <v-combobox
                    v-model="user_id"
                    :rules="[rules.required]"
                    :items="all_users"
                    item-text="surname"
                    item-value="id"
                    label="Name"
                    class="green-input"/>
                </v-flex>
                <v-flex
                  xs12
                  md6
                  text-xs-right
                >
                  <v-btn
                    type="submit"
                    class="mx-0 font-weight-light"
                    color="success"
                  >
                    Submit
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </material-card> <br>

        <material-card>

            <v-layout wrap>
            <v-flex
              xs10
              md6
            >  

            <p class="display-1 text--primary">
                Admins List
            </p>
            </v-flex>  

            <v-flex
              xs10
              md6
            >
              <!-- <v-btn
                :loading="downloadLoading"
                color="primary"
                @click="handleDownload">
                <v-icon left>mdi-download</v-icon>Export Excel
              </v-btn> -->
            </v-flex>  
              
            </v-layout>

              <v-data-table 
                :headers="headers"
                :items="admins"
                :loading="true"
                :rows-per-page-items="rowsPerPageItems"
                class="elevation-1"
              >
              <template
                slot="headerCell"
                slot-scope="{ header }"
              >
                <span
                  class="subheading text--darken-3"
                  v-text="header.text"
                />
              </template>

              <template
                  slot="items"
                  slot-scope="{ item }"
                >
                <tr>
                  <td>{{ item.first_name }}</td>
                  <td>{{ item.surname }}</td>
                  <td>{{ item.email }}</td>
                </tr>  
                </template>
              </v-data-table>

        </material-card>
      </v-flex>

    </v-layout>
    <v-snackbar
      :color="color"
      :bottom="bottom"
      :top="top"
      :left="left"
      :right="right"
      v-model="snackbar"
      dark
    >
      <v-icon
        color="white"
        class="mr-3"
      >
        mdi-bell-plus
      </v-icon>
      <div>{{ pre_out }} {{ output.message }}<br> {{ output.errors }}</div>
      <v-icon
        size="16"
        @click="snackbar = false"
      >
        mdi-close-circle
      </v-icon>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  //
  data () {
    return {
      rowsPerPageItems: [50, 250, 500],
      switch1: true,
      name: '',
      load:true,
      facility_id: '',
      user_id: '',
      facilities: [],
      headers: [
        {
          sortable: false,
          text: 'First Name',
          value: 'first_name'
        },
        {
          sortable: false,
          text: 'Surname',
          value: 'surname'
        },
        {
          sortable: false,
          text: 'Email',
          value: 'email'
        }
      ],
      items: [],
      facilities_all: [],
      all_users: [],
      admins: [],
      rules: {
        required: value => !!value || 'Required.'
      },
      resp: false,
      output: '',
      pre_out: '',
      color: null,
      colors: [
        'success',
        'error'
      ],
      top: true,
      bottom: false,
      left: false,
      right: false,
      snackbar: false,
      downloadLoading: false,
      filename: 'Devices',
      autoWidth: true,
      bookType: 'xlsx'
    }
  },
  created () {
    this.Facilities()
    this.Admins()
    this.UsersList()
  },

  methods: {
    checkData () {
      if (this.facility_id == '') {
        this.pre_out = 'Pick facilty to proceed'
        this.snack('top', 'center')
        return false
      } else if (this.name == '') {
        this.pre_out = 'Provide device name to proceed'
        this.snack('top', 'center')
        return false
      } else { return true }
    },
    Admins () {
      axios.get('facility/admins/all')
        .then((users) => {
          console.log(users.data)

          this.admins = users.data.data
        })
        .catch(error => console.log(error.message))
    },
    async loopT (l) {
      var i
      for (i = 0; i < 1;) {
        if (l != null) {
          let response = await axios.get(l)
          l = response.data.links.next
          this.all_users = this.admins.concat(response.data.data)
        } else {
          i = 11
        }
      }
      this.FilterAdmns()
    },
    
    Facilities () {
      axios.get('facilities')
        .then((resp) => {
          this.facilities_all = resp.data.data
          for (var k in this.facilities_all) {
            var p = new Object()
            p.text = this.facilities_all[k].name
            p.value = this.facilities_all[k]
            this.facilities.push(p)
          }
          this.load = false
        })
      
    },

    UsersList () {
      // setTimeout(function () {
      axios.get(`users`)
        .then((users) => {
          this.all_users = users.data.data

          console.log(users.data)
        })
        .catch(error => console.log(error.message))
      // }, 1000);
    },

    AddAdmin(e) {
      e.preventDefault()
      if (this.checkData()) {
        // console.log(this.facility_id.value.id)
        axios.post('facility_admin/assign', {
          facility_id: this.facility_id.value.id,
          user_id: this.name.value.id
        })
          .then((response) => {
            this.output = response.data
            this.resp = Boolean(response.data.success)
            this.snack('top', 'center')
            this.items = []
            this.Admins()
          })
          .catch((error) => {
            this.output = error
            this.snack('top', 'center')
          })
      }
    },
    handleDownload () {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Name', 'Safety Designed', 'Created On']
        const filterVal = ['name', 'safety_designed', 'created_at']
        const list = this.items

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
      console.log(jsonData)
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          console.log(jsonData)
          return v[j]
        }
      }))
    },
    snack (...args) {
      this.top = false
      this.bottom = false
      this.left = false
      this.right = false

      for (const loc of args) {
        this[loc] = true
      }
      if (this.resp) {
        this.color = this.colors[0]
      } else {
        this.color = this.colors[1]
      }
      this.snackbar = true
    }
  }
}
</script>
