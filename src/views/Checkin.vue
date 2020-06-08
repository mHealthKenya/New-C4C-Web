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
        <material-card
          color="green"
          title="Broadcast Messages"
        >
          <v-card-text>
            <div/>
            <p class="display-1 text--primary">
              List of Checkins
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
            :items="users"
            :search="search"
            :rows-per-page-items="rowsPerPageItems"
          >
            <template
              slot="items"
              slot-scope="props">
              <tr @click="props.expanded = !props.expanded">
                <td>{{ props.item.id }}</td>
                <td>{{ props.item.user_id }}</td>
                <td>{{ props.item.created_at }}</td>
                <td>
                  <v-btn
                    :loading="downloadLoading"
                    :disabled="Boolean(props.item.approved)"
                    type="submit"
                    color="secondary"
                    @click.prevent="approvCh(props.item.id)">
                    Approve<v-icon right>mdi-check</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
            <template
              slot="expand"
              slot-scope="props">
              <v-card flat>
                <v-card-text>
                  <div class="maps">
                    <l-map
                      :zoom="zoom"
                      :center="LatLng(props.item.lat, props.item.lng)">
                      <l-tile-layer
                        :url="url"
                        :attribution="attribution"/>
                      <l-marker :lat-lng="LatLng(props.item.lat, props.item.lng)"/>
                    </l-map>
                  </div>
                </v-card-text>
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
    <v-snackbar
      :color="'#f55a4e'"
      v-model="showResult"
      :timeout="2000"
      top>
      {{ result }}
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import L from 'leaflet'
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker
  },
  data () {
    return {
      map: null,
      zoom: 11,
      center: L.latLng(0, 0),
      url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: L.latLng(0, 0),
      rowsPerPageItems: [50, 250, 500],
      search: '',
      link: '',
      output: [],
      headers: [
        {
          text: 'ID',
          value: 'id'
        },
        {
          text: 'User',
          value: 'user_id'
        },
        {
          text: 'Date',
          value: 'Date'
        },
        {
          text: 'Approve',
          value: 'approve'
        }
      ],
      users: [],
      result: '',
      showResult: false,
      downloadLoading: false,
      filename: 'Checkins',
      autoWidth: true,
      bookType: 'xlsx'
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },
  mounted () {
    this.getChec()
  },
  methods: {
    getChec () {
      axios.get(`check_in/history/facility/${this.user.hcw.facility_id}`)
        .then((exp) => {
          this.users = exp.data.data
          this.link = exp.data.links.next
          this.loopT(this.link)
        })
        .catch(error => console.log(error.message))
    },
    async loopT (l) {
      var i
      for (i = 0; i < 1;) {
        if (l != null) {
          let response = await axios.get(l)
          l = response.data.links.next
          this.users = this.users.concat(response.data.data)
        } else {
          i = 11
        }
      }
      console.log(this.users)
    },
    approvCh (checkId) {
      console.log(checkId)
      axios.post('check_in/approve', {
        check_in_id: checkId
      })
        .then((r) => {
          this.result = r.data
          this.showResult = true
          this.users = []
          this.getChec()
        })
        .catch(() => {
          this.error = true
          this.showResult = true
        })
    },
    LatLng (lat, lng) {
      return L.latLng(lat, lng)
    },
    handleDownload () {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Cadre', 'Previous Exposures', 'Type', 'Location', 'Date']
        const filterVal = ['cadre', 'previous_exposures', 'type', 'location', 'date']
        const list = this.users
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
          return v[j].name
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
<style scoped>
  .maps {
    height: 700px
  }
  .map { height: 600px }
</style>
