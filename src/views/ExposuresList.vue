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
          <div> {{ output.error }} {{ result }}</div>
          <v-icon
            size="16"
            @click="snackbar = false"
          >
            mdi-close-circle
          </v-icon>
        </v-snackbar>

        <material-card
          color="green"
          title="Broadcast Messages"
        >
          <v-card-text>
            <div/>
            <p class="display-1 text--primary">
              List of Exposures
            </p>
          </v-card-text>
          <v-container py-0>
            <v-layout wrap>
              <v-flex
                xs12
                md10>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-search-web"
                  label="Search"
                  single-line
                  hide-details
                />
              </v-flex>
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
            </v-layout>
          </v-container><br>

          <v-data-table
            :headers="headers"
            :items="exposures"
            :search="search"
            :rows-per-page-items="rowsPerPageItems"
            :loading="true"
          >

          <template slot='no-data'>
              <v-progress-linear slot='progress' indeterminate></v-progress-linear>
          </template>

            <template
              slot="items"
              slot-scope="props">
              <tr @click="props.expanded = !props.expanded">
                <td>{{ exposures.indexOf(props.item)+1 }}</td>
                <td>{{ props.item.gender }}</td>
                <td>{{ props.item.cadre }}</td>
                <td>{{ props.item.facility }}</td>
                <td v-if="props.item.device_used">{{ props.item.device_used }}</td>
                <td v-else>Not Specified</td>
                <td>{{ props.item.exposure_type }}</td>
                <td>{{ props.item.exposure_location }}</td>
                <td>{{ Boolean(props.item.pep_initiated) }}</td>
                <td>{{ props.item.exposure_date }}</td>
                <td>
                  <v-icon v-if="props.expanded">mdi-arrow-down</v-icon>
                  <v-icon v-else>mdi-arrow-right</v-icon>
                </td>
              </tr>
            </template>
            <template
              slot="expand"
              slot-scope="props">
              <v-card 
                outlined 
                :dark="true">
                <v-container py-0>
                  <v-layout wrap>
                    <v-flex
                      xs12
                      md6
                    >
                      <v-card-text>
                        facility: {{ props.item.facility }} <br>
                        Pep Date: {{ props.item.pep_date }} <br>
                        patient hiv status: {{ props.item.patient_hiv_status }} <br>
                        patient hbv status: {{ props.item.patient_hbv_status }}
                      </v-card-text>
                    </v-flex>
                    <v-flex
                      xs12
                      md4
                    >
                      <v-card-text>
                        device purpose: {{ props.item.device_purpose }} <br>
                        previous exposures: {{ props.item.previous_exposures }} <br>
                        exposure result of: <span v-text="props.item.result_of ? props.item.result_of : 'Not specified'"></span> <br>
                        exposure description: {{ props.item.exposure_description }}
                      </v-card-text>
                    </v-flex>

                  </v-layout>
                </v-container>
              </v-card>
            </template>
            <v-alert
              slot="no-results"
              :value="true"
              color="success"
              icon="mdi-emoticon-sad">
              Your search for "{{ search }}" found no results.
            </v-alert>
          </v-data-table>
        </material-card>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      rowsPerPageItems: [100, 500, 1000],
      search: '',
      link: '',
      output: '',
      isLoading: true,
      result: '',
      snackbar: false,
      headers: [
        {
          text: 'No.',
          value: 'No.'
        },
        {
          sortable: false,
          text: 'Gender',
          value: 'gender'
        },
        {
          text: 'Cadre',
          value: 'cadre'
        },
        {
          text: 'Facility',
          value: 'facility'
        },
        {
          text: 'Device',
          value: 'device_used'
        },
        {
          sortable: false,
          text: 'Type',
          value: 'exposure_type'
        },
        {
          text: 'Location',
          value: 'exposure_location'
        },
        {
          text: 'Pep Initiated',
          value: 'pep_initiated'
        },
        {
          text: 'Exposure Date',
          value: 'exposure_date'
        }
      ],
      exposures: [],
      downloadLoading: false,
      filename: `Exposures ${new Date().toISOString()}`,
      autoWidth: true,
      bookType: 'xlsx'
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      token: 'auth/token',
      e: 'auth/expo'
    })
  },
  created () {
    if (this.exposures.length === 0) {
      this.getExp()
    } else {
      this.exposures = this.e
    }
  },
  methods: {
    getExp () {
      if (this.user.role_id === 1 || this.user.role_id === 2 || this.user.role_id === 5) {
        axios.get(`exposures/all`)
          .then((response) => {
            this.exposures = response.data.data
            this.link = response.data.links.next
            if (this.link) {
              this.loopT(this.link)
              this.isLoading = false
            }
          })
          .catch(() => {
            this.error = true
            this.result = 'Check your internet connection or retry logging in.'
            this.snackbar = true
          })
      } else if (this.user.role_id === 4) {
        axios.get(`exposures/facility/${this.user.hcw.facility_id}`)
          .then((exp) => {
            this.exposures = exp.data.data
            this.link = exp.data.links.next
            if (this.link) {
              this.loopT(this.link)
              this.isLoading = false
            }
          })
          .catch(() => {
            this.error = true
            this.result = 'Check your internet connection or retry logging in.'
            this.snackbar = true
          })
      }
    },

    async loopT (l) {
      var i
      var u = []
      if (this.user.role_id ===1) {
        for (i = 0; i < 1;) {
          if (l != null) {
            let response = await axios.get(l)
            l = response.data.links.next
            this.exposures = this.exposures.concat(response.data.data)
          } else {
            i = 11
          }
        }
      } else if (this.user.role_id === 5) {
        for (i = 0; i < 1;) {
          if (l != null) {
            let response = await axios.get(l)
            l = response.data.links.next
            this.exposures = this.exposures.concat(response.data.data)
          } else {
            i = 11
          }
        }
        i = 0
        for (i in this.exposures) {
          if (this.exposures[i].county === this.user.county) {
            u.push(this.exposures[i])
          }
        }
        this.exposures = u
      }
    },
    handleDownload () {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Gender', 'Cadre', 'Facility', 'Previous Exposures', 'Type', 'Device', 'Location', 'Result', 'Description', 'Patient HIV Status', 'Patient HBV Status', 'Pep initiated', 'Pep Date', 'Exposure Date']
        const filterVal = ['gender', 'cadre', 'facility', 'previous_exposures', 'exposure_type', 'device_used', 'exposure_location', 'result_of', 'exposure_description', 'patient_hiv_status', 'patient_hbv_status', 'pep_initiated', 'pep_date', 'exposure_date']
        const list = this.exposures
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
        console.log(v)
        if (v[j] === '') {
          console.log(v[j])
          return 'Not Specified'
        } else if (j === 'pep_initiated') {
          return Boolean(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
