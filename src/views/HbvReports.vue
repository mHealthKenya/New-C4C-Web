  <template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-layout wrap>
      <template>
        <!-- Start filters -->
        <v-layout >
          <v-flex
            xs12
            md6
            lg3
          >
            <template>
              <v-combobox
                v-if="user.role_id === 1 || user.role_id === 2 "
                v-model="counties"
                :items="all_counties"
                item-text="name"
                item-value="id"
                label="Select County"
                v-on:change="getSubCounties"
                multiple
                clerable
                persistent-hint
                chips/>
            </template>
          </v-flex>
          <v-flex
            xs12
            md6
            lg3
          >
            <template>
              <v-combobox
                v-if="user.role_id !== 4"
                v-model="subcounties"
                :items="all_subcounties"
                item-text="name"
                item-value="id"
                label="Select Sub-County"
                :disabled="active"
                v-on:change="facilitySubCounty"
                multiple
                clerable
                persistent-hint
                chips/>

            </template>
          </v-flex>

          <v-flex
            xs12
            md6
            lg3
          >

            <template>

              <v-combobox
                v-if="user.role_id !== 4"
                v-model="facility"
                :items="fac"
                item-text="partner"
                item-value="id"
                label="Select Partner"
                multiple
                clerable
                disabled
                persistent-hint
                chips/>

            </template>
          </v-flex>

          <v-flex
            xs12
            md6
            lg3
          >

            <template>

              <v-combobox
                v-if="user.role_id !== 4"
                :items="all_facilities_level"
                label="Select Facility Level"
                v-on:change="facilityLevel"
                :disabled="active_level"
                multiple
                clerable
                persistent-hint
                chips/>

            </template>
          </v-flex>

          <v-flex
            xs12
            md6
            lg3
          >
            <template>
              <v-combobox
                v-if="user.role_id !== 4"
                v-model="facility"
                :items="fac"
                item-text="name"
                item-value="id"
                label="Select Facility"
                v-on:change="facilityFilter"
                :disabled="active_fac"
                multiple
                clerable
                persistent-hint
                chips/>

            </template>
          </v-flex>
        </v-layout>

        <template>
          <v-flex xs12 sm6 md2>
            <v-menu
              ref="menu1"
              :close-on-content-click="false"
              v-model="menu1"
              :nudge-right="40"
              :return-value.sync="startDate"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="startDate"
                label="Start Date"
                prepend-icon="mdi-calendar"
                readonly
              ></v-text-field>
              <v-date-picker :dark="true" v-model="startDate" no-title scrollable :max="endDate" :min="minDate">
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="menu1 = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="click();$refs.menu1.save(startDate);click">OK</v-btn>
              </v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs12 sm6 md2>
            <v-menu
              ref="menu"
              :close-on-content-click="false"
              v-model="menu"
              :nudge-right="40"
              :return-value.sync="endDate"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="endDate"
                label="End Date"
                prepend-icon="mdi-calendar"
                readonly
              ></v-text-field>
              <v-date-picker :dark="true" v-model="endDate" no-title scrollable :max="maxDate" :min="startDate">
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="click();$refs.menu.save(endDate)">OK</v-btn>
              </v-date-picker>
            </v-menu>
          </v-flex>
        </template>

        <div class="text-center"> 
          
          <v-btn
            x-large
            color="secondary"
            darknt
            @click="click">Filter</v-btn>

        <v-btn
            :loading="downloadLoading"
            color="primary"
            x-large
            @click="handleDownload">
            <v-icon left>mdi-download</v-icon>Export Excel
        </v-btn>

      </div>

        <!-- End filters -->
      </template>
      <template>
        <v-flex
          xs12
          md12
          >
          <div class="card vld-parent">
            <loading :active.sync="isLoading" 
            :can-cancel="false" 
            :on-cancel="onCancel"
            loader='dots'
            :is-full-page="fullPage"></loading>
            <h3/>
            <highcharts
              ref="columnChart"
              :options="barOptionsHBV"/>
          </div>
        </v-flex>
      </template>

    </v-layout>
  </v-container>
</template>

<script>
import { Chart } from 'highcharts-vue'
import axios from 'axios'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import Highcharts from 'highcharts'
import moment from 'moment'
import { mapGetters } from 'vuex'

import { EventBus } from './../event-bus.js'

export default {
  components: {
    Loading,
    highcharts: Chart
  },
  data () {
    return {
      isLoading: true,
      fullPage: false,
      menu: false,
      menu1: false,
      startDate: '2017-01-01',
      maxDate: new Date().toISOString().substr(0, 10),
      minDate: '2017-01-01',
      endDate: new Date().toISOString().substr(0, 10),
      facility: '',
      counties: '',
      subcounties: '',
      fac: [],
      all_facilities: [],
      all_facilities_level: ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5 and Above'],
      all_counties: [],
      all_subcounties: [],
      active: true,
      active_fac: true,
      active_level: true,

      downloadLoading: false,
      filename: `HBV Report ${new Date().toISOString()}`,
      autoWidth: true,
      bookType: 'xlsx',

      barOptionsHBV: {
        chart: {
          type: 'column',
          options3d: {
            enabled: true,
            alpha: 45
          }
        },
        title: {
          text: 'Immunizations by HBV'
        },
        xAxis: {
          //
          categories: ['Dose 1', 'Dose 2', 'Dose 3']
          //  categories: ['01', '02', '03', '04', '05','06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '00' ]

        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true
            }
          }
        },
        labels: {
          items: [
            {
              html: '',
              style: {
                left: '50px',
                top: '18px',
                color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
              }
            }
          ]
        },
        series: [
          {
            // type: 'column',
            colorByPoint: true,
            name: 'HBV Immunizations',
            data: []
          }

        ]
      },
      seriesname: [1, 2, 3],
      hbvs: [],

      s: [],
      userz: [],
      load: true,

      fac_filt: [],
      exp_filt: [],
      us_filt: [],
      fac_filtl: [],
      exp_filtl: [],
      us_filtl: [],
      fac_filtf: [],
      exp_filtf: [],
      us_filtf: []
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },
  created () {
    this.getImmunizations()
    this.getFacilities()
    this.getCounties()
  },
  methods: {
    onCancel() {
      console.log('User cancelled the loader.')
    },
    click () {
      let exp = []
      var dates = {
        convert:function(d) {
          return (
            d.constructor === Date ? d :
            d.constructor === Array ? new Date(d[0],d[1],d[2]) :
            d.constructor === Number ? new Date(d) :
            d.constructor === String ? new Date(d) :
            typeof d === "object" ? new Date(d.year,d.month,d.date) :
            NaN
          );
        },
        inRange:function(d,start,end) {
          return (
            isFinite(d=this.convert(d).valueOf()) &&
            isFinite(start=this.convert(start).valueOf()) &&
            isFinite(end=this.convert(end).valueOf()) ?
            start <= d && d <= end :
            NaN
          );
        }
      }
      for (var e in this.s) {
        var i = new Date(this.s[e].created_at).toISOString().substr(0, 10)
        if (dates.inRange(i,this.startDate,this.endDate)){
          exp.push(this.s[e])
        }
      }
      this.getHBV(exp)
      console.log('l')
      console.log(this.getHBV(exp))
    },
    getFacilities () {
      axios.get('facilities')
        .then((facilities) => {
          console.log(facilities.data)
          this.all_facilities = facilities.data.data
        })
        .catch(error => console.log(error.message))
    },
    getCounties () {
      axios.get('counties')
        .then((counties) => {
          console.log(counties.data.data)
          this.all_counties = counties.data.data
        })
        .catch(error => console.log(error.message))
    },

    getSubCounties (a) {
      console.log(a)
      if (a.length > 0) {
        this.active = false
        this.all_subcounties = []
        for (var i in a) {
          axios.get(`subcounties/${a[i].id}`)
            .then((subcounties) => {
              this.all_subcounties = this.all_subcounties.concat(subcounties.data.data)
            })
            .catch(error => console.log(error.message))
        }
        this.facilityCounty(a)
      } else {
        this.active = true
        this.facilityCounty(a)
      }
    },
    facilityCounty (a) {
      this.us_filt =[],this.fac_filt = [], this.exp_filt = []
      if (a.length > 0) {
        for (var c in a) {
          for (var f in this.all_facilities) {
            if (this.all_facilities[f].county == a[c].name) {
              this.fac_filt.push(this.all_facilities[f])
            }
          }
          for (var ex in this.s) {
            if (this.s[ex].county == a[c].name) {
              this.exp_filt.push(this.s[ex])
            }
          }
        }
        this.getHBV(this.exp_filt)
        this.fac = this.fac_filt.sort()
      } else {
        this.fac = this.all_facilities
        this.getHBV(this.s)
      }
    },
    facilitySubCounty (a) {
      this.exp_filtl = [], this.fac_filtl = [], this.us_filtl = []
      this.active_level = false
      if (a.length > 0) {
        for (var c in a) {
          for (var f in this.fac_filt) {
            if (this.fac_filt[f].sub_county == a[c].name) {
              this.fac_filtl.push(this.fac_filt[f])
            }
          }
          for (var ex in this.exp_filt) {
            if (this.exp_filt[ex].sub_county == a[c].name) {
              this.exp_filtl.push(this.exp_filt[ex])
            }
          }
        }
        this.getHBV(this.exp_filtl)
        this.fac = this.fac_filtl.sort()
      } else {
        this.fac = this.fac_filt
        this.getHBV(this.exp_filt)
        this.active_level = true
      }
    },

    facilityLevel (a) {
      this.fac_filtf = [], this.exp_filtf = []
      this.active_fac = false
      console.log(a)
      if (a.length > 0) {
        for (var c in a) {
          for (var f in this.fac_filtl) {
            if (this.fac_filtl[f].level == a[c]) {
              this.fac_filtf.push(this.fac_filtl[f])
            } else if (a[c]== 'Level 5 and Above') {
              if (Number(this.fac_filtl[f].level.slice(6,7)) >= 5) {
                this.fac_filtf.push(this.fac_filtl[f])
              }
            }
          }
          for (var ex in this.exp_filtl) {
            if (this.exp_filtl[ex].facility_level == a[c]) {
              this.exp_filtf.push(this.exp_filtl[ex])
            } else if (a[c]== 'Level 5 and Above') {
              if (Number(this.exp_filtl[ex].facility_level.slice(6,7)) >= 5) {
                this.exp_filtf.push(this.exp_filtl[ex])
              }
            }
          }
        }
        this.getHBV(this.exp_filtf)
        this.fac = this.fac_filtf.sort()
      } else {
        this.fac = this.fac_filtl
        this.active_fac = true
        this.getHBV(this.exp_filtl)
      }
    },

    facilityFilter (a) {
      let b = [], e = [], us = []

      if (a.length > 0) {
        for (var c in a) {
          for (var ex in this.exp_filtf) {
            if (this.exp_filtf[ex].facility_name == a[c].name) {
              e.push(this.exp_filtf[ex])
            }
          }
        }
        this.getHBV(e)
      } else {
        this.getHBV(this.exp_filtf)
      }
    },

    getImmunizations () {
      if (this.user.role_id === 1 || this.user.role_id == 2 || this.user.role_id == 5) {
        axios.get('immunizations/all/disease/1')
          .then((exp) => {
            this.s = exp.data.data
            if (exp.data.links.next != null) {
              this.link = exp.data.links.next
              this.loopT(this.link)
              console.log(exp.data)
            } else {
              this.getHBV(this.s)
              this.isLoading = false
            }
          })
          .catch(error => console.log(error.message))
      } else if (this.user.role_id === 4) {
        axios.get(`immunizations/facility/${this.user.hcw.facility_id}/disease/1`)
          .then((exp) => {
            this.s = exp.data.data
            if (exp.data.links.next != null) {
              this.link = exp.data.links.next
              this.loopT(this.link)
            } else {
              this.getHBV(this.s)
              this.isLoading = false
            }
          })
          .catch(error => console.log(error.message))
      }
    },
    async loopT (l) {
      var i
      for (i = 0; i < 1;) {
        if (l != null) {
          let response = await axios.get(l)
          l = response.data.links.next
          this.s = this.s.concat(response.data.data)
        } else {
          i = 11
        }
      }
      this.getHBV(this.s)
      this.isLoading = false
    },
    getHBV (list) {
      this.seriesdata = []
      for (var vac in this.seriesname) {
        this.seriesdata.push(this.getNum(vac, list))
      }
      this.barOptionsHBV.series[0].data = this.seriesdata
    },
    getNum (name, list) {
      var a = [], b = [], prev, count = 0, arr = []
      for (var f in list) {
        arr.push(list[f].user_id)
      }
      arr.sort()
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== prev) {
          a.push(arr[i])
          b.push(1)
        } else {
          b[b.length - 1]++
        }
        prev = arr[i]
      }console.log(b.length)
      for (var u in b) {
        if (name == 0 && b[u]) {
          count++
        } else if (name == 1 && b[u] === 2 || b[u] === 3) {
          count++
        } else if (name == 2 && b[u] === 3) {
          count++
        }
      }
      return count
    },

    handleDownload () {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['First Name', 'Surname', 'Gender','Phone Number','Disease Name', 'Date', 'County', 'Sub County', 'Facility Name','Facility Level']
        const filterVal = ['first_name', 'surname','gender', 'msisdn', 'disease', 'date', 'county', 'sub_county', 'facility_name', 'facility_level']
        const list = this.s
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
        if (j === 'msisdn') {
          return v[j]
        } else {
          return v[j]
        }
      }))
    }

  }
}
</script>

<style>
.v-btn {
  margin-right: 130px;
}
</style>
