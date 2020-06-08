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
        md10
      >
        <material-card
          color="green"
          title="Add a New Device"
          text="Kindly fill all the required fields"
        >
          <v-card-text>
            <div/>
            <p class="display-1 text--primary">
              Add A New Device
            </p>
            <div class="text--primary">
              Kindly fill all the required fields
            </div>
          </v-card-text>
          <v-form @submit="AddDevice">
            <v-container py-0>
              <v-layout wrap>
                <v-flex
                  xs12
                  md3
                >
                  <v-combobox
                    v-model="facility_id"
                    :rules="[rules.required]"
                    :items="facilities"
                    label="Facility"
                    class="purple-input"
                  />
                </v-flex>
                <v-flex
                  xs12
                  md6
                >
                  <v-text-field
                    v-model="name"
                    :rules="[rules.required]"
                    label="Name"
                    class="green-input"/>
                </v-flex>
                <v-flex
                  xs12
                  md3
                >
                  <v-switch
                    v-model="switch1"
                    :label="`Safety Engineered?  ${switch1.toString()}`"/>
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

        <material-card
          color="blue"
          title="Add a New Device"
          text="Devices List">
          <v-layout wrap>
            <v-card-text>
              <div/>
              <p class="display-1 text--primary">
                Devices List
              </p>
              <v-btn
                :loading="downloadLoading"
                style="margin:0 0 20px 20px;"
                color="primary"
                @click="handleDownload">
                <v-icon left>mdi-download</v-icon>Export Excel
              </v-btn>
            </v-card-text>
            <template>
              <v-data-table
                :headers="headers"
                :items="items"
                :loading="true"
                :rows-per-page-items="rowsPerPageItems"
                class="elevation-1"
              ><template
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
                  <td>{{ item.name }}</td>
                  <td>{{ Boolean(item.safety_designed) }}</td>
                  <td>{{ item.created_at }}</td>
                </template>
              </v-data-table>
            </template>
          </v-layout>
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
      facility_id: '',
      facilities: [],
      headers: [
        {
          sortable: false,
          text: 'Name',
          value: 'name'
        },
        {
          sortable: false,
          text: 'Safety Design',
          value: 'safety_designed'
        },
        {
          sortable: false,
          text: 'Created On',
          value: 'created_at'
        }
      ],
      items: [],
      facilities_all: [],
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
    this.DeviceList()
    this.Facilities()
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
    Facilities () {
      axios.get('facilities')
        .then((resp) => {
          this.facilities_all = resp.data.data
          for (var k in resp.data.data) {
            this.facilities.push(this.facilities_all[k].name)
          }
        })
    },
    DeviceList () {
      axios.get('devices/all/')
        .then((exp) => {
          this.items = exp.data.data
          console.log(exp.data)
        })
        .catch(error => console.log(error.message))
    },
    AddDevice (e) {
      e.preventDefault()
      if (this.checkData()) {
        axios.post('devices/create', {
          facility_id: this.facilities_all[this.facilities.indexOf(this.facility_id)].id,
          name: this.name,
          safety_designed: this.switch1
        })
          .then((response) => {
            this.output = response.data
            this.resp = Boolean(response.data.success)
            this.snack('top', 'center')
            this.items = []
            this.DeviceList()
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
