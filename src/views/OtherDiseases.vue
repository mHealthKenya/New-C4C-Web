<template>
  <v-container
   fluid
   grid-list-xl>

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
              multiple
              clerable
              persistent-hint
              chips
              @change="getSubCounties"/>
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
                :disabled="active"
                item-text="name"
                item-value="id"
                label="Select Sub-County"
                multiple
                clerable
                persistent-hint
                chips
                @change="facilitySubCounty"/>

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
                :disabled="active_level"
                label="Select Facility Level"
                multiple
                clerable
                persistent-hint
                chips
                @change="facilityLevel"/>
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
                :disabled="active_fac"
                item-text="name"
                item-value="id"
                label="Select Facility"
                multiple
                clerable
                persistent-hint
                chips
                @change="facilityFilter"/>

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
              />
              <v-date-picker
                :dark="true"
                v-model="startDate"
                :max="maxDate"
                :min="minDate"
                no-title
                scrollable>
                <v-spacer/>
                <v-btn
                  flat
                  color="primary"
                  @click="menu1 = false">Cancel</v-btn>
                <v-btn
                  flat
                  color="primary"
                  @click="$refs.menu1.save(startDate)">OK</v-btn>
              </v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex
            xs12
            sm6
            md2>
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
              />
              <v-date-picker
                :dark="true"
                v-model="endDate"
                :max="maxDate"
                :min="minDate"
                no-title
                scrollable>
                <v-spacer/>
                <v-btn
                  flat
                  color="primary"
                  @click="menu = false">Cancel</v-btn>
                <v-btn
                  flat
                  color="primary"
                  @click="$refs.menu.save(endDate)">OK</v-btn>
              </v-date-picker>
            </v-menu>
          </v-flex>
        </template>

       
        <div class="text-center"> 
          
          <v-btn
            x-large
            color="secondary"
            dark
            @click="click">Filter</v-btn>

        <v-btn
            :loading="downloadLoading"
            color="primary"
            x-large
            @click="handleDownload">
            <v-icon left>mdi-download</v-icon>Export Excel
        </v-btn>

      </div>  

      </template>
      </v-layout>

       <!-- End filters -->

    <v-card>  
    <v-tabs
      color="white"
      centered
    >
      <v-tab>Summary Report</v-tab>
      <v-tab>Measles</v-tab>
      <v-tab>Influenza</v-tab>
      <v-tab>TDAP</v-tab>
      <v-tab>Varicella</v-tab>
      <v-tab>Meningococcal</v-tab>

      <!-- Start Cards -->

      <v-tab-item
        v-for="n in 6"
        :key="n">
        <v-container fluid>
          <v-card-text v-if="n==1">
            <!-- Start Graphs -->

            <v-flex
              md12
              sm12
              lg12
            >
              <div class="card vld-parent">
                <loading
                  :active.sync="isLoading"
                  :can-cancel="false"
                  color="#007bff"
                  :is-full-page="false">
                </loading>
                  <highcharts
                    ref="columnChart"
                    :options="AllDiseaseschartOptions"/>
              </div>
            </v-flex>
          </v-card-text>

          <v-card-text v-if="n==2">
            <!-- Start Graphs -->

            <v-flex
              md12
              sm12
              lg12
            >

              <h3>Miseasles Summary</h3>
              <highcharts
                ref="columnChart"
                :options="CountMeaslesChartOptions"/>

              <highcharts
                ref="columnChart"
                :options="MeaslesChartOptions"/>

            </v-flex>
          </v-card-text>
          <v-card-text v-if="n==3"> <!-- Start Graphs -->

            <v-flex
              md12
              sm12
              lg12
            >

              <h3>Influenza Summary</h3>
              <highcharts
                ref="columnChart"
                :options="InfluenzaChartOptions"/>

            </v-flex>
          </v-card-text>
          <v-card-text v-if="n==4">
            <!-- Start Graphs -->

            <v-flex
              md12
              sm12
              lg12
            >

              <h3>TDAP Summary</h3>
              <highcharts
                ref="columnChart"
                :options="TDAPChartOptions"/>

            </v-flex>
          </v-card-text>

          <v-card-text v-if="n==5">
            <!-- Start Graphs -->

            <v-flex
              md12
              sm12
              lg12
            >

              <h3>Varicella Summary</h3>
              <highcharts
                ref="columnChart"
                :options="VaricellaChartOptions"/>

            </v-flex>
          </v-card-text>

          <v-card-text v-if="n==6">
            <!-- Start Graphs -->

            <v-flex
              md12
              sm12
              lg12
            >

              <h3>Meningococcal Summary</h3>
              <highcharts
                ref="columnChart"
                :options="MeningococcalChartOptions" />

            </v-flex>
          </v-card-text>
        </v-container>
      </v-tab-item>
    </v-tabs>
    </v-card>
    
    
  </v-container>
</template>

<script>
import { Chart } from 'highcharts-vue'
import Highcharts from 'highcharts'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import exportingInit from 'highcharts/modules/exporting'
import axios from 'axios'
import { mapGetters } from 'vuex'
import moment from 'moment'

// SeriesLabel(Highcharts);
exportingInit(Highcharts)

export default {
  components: {
    Loading,
    highcharts: Chart
  },
  data () {
    return {
      isLoading: true,
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
      filename: `Other Diseases Report ${new Date().toISOString()}`,
      autoWidth: true,
      bookType: 'xlsx',

      AllDiseaseschartOptions: {
        xAxis: {
          categories: ['MALE', 'FEMALE' ],
          title: {
            text: 'Disease Immunized against'
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'No. of HCWs Immunized',
            align: 'high'
          },
          labels: {
            overflow: 'justify'
          }
        },
        chart: {
          height: 700,
          type: 'column'
        },
        title: {
          text: 'Number of HCWs immunized'
        },
        series: [{
          name: ['Measles'],
          data: []
        },
        {
          name: ['Influenza'],
          data: []
        },
        {
          name: ['TDAP'],
          data: []
        },
        {
          name: ['Vericella'],
          data: []
        },
        {
          name: ['Meningococcal'],
          data: []
        }
        ]
      },

      MeningococcalChartOptions: {
        chart: {
          type: 'column',
          options3d: {
            enabled: true,
            alpha: 45
          }
        },
        title: {
          text: 'Immunizations|Meningococcal'
        },
        subtitle: {
          // text: 'by Cadre'
        },
        xAxis: {
          //
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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
            name: 'Meningococcal Immunizations',
            data: []
          }

        ]
      },

      VaricellaChartOptions: {
        chart: {
          type: 'column',
          options3d: {
            enabled: true,
            alpha: 45
          }
        },
        title: {
          text: 'Immunizations|Varicella'
        },
        subtitle: {
          // text: 'by Cadre'
        },
        xAxis: {
          //
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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
            name: 'Varicella Immunizations',
            data: []
          }

        ]
      },

      TDAPChartOptions: {
        chart: {
          type: 'column',
          options3d: {
            enabled: true,
            alpha: 45
          }
        },
        title: {
          text: 'Immunizations|TDAP'
        },
        subtitle: {
          // text: 'by Cadre'
        },
        xAxis: {
          //
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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
            name: 'TDAP Immunizations',
            data: []
          }

        ]
      },

      InfluenzaChartOptions: {
        chart: {
          type: 'column',
          options3d: {
            enabled: true,
            alpha: 45
          }
        },
        title: {
          text: 'Immunizations|Inlfuenza'
        },
        subtitle: {
          // text: 'by Cadre'
        },
        xAxis: {
          //
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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
            name: 'Influenza Immunizations',
            data: []
          }
        ]
      },

      MeaslesChartOptions: {
        chart: {
          type: 'column',
          options3d: {
            enabled: true,
            alpha: 45
          }
        },
        title: {
          text: 'Immunizations|Measles'
        },
        subtitle: {
          // text: 'by Cadre'
        },
        xAxis: {
          //
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
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
            name: 'Measles Immunizations',
            data: []
          }

        ]
      },
      CountMeaslesChartOptions: {
        chart: {
          type: 'column',
          options3d: {
            enabled: true,
            alpha: 45
          }
        },
        title: {
          text: 'Immunization Doses|Measles'
        },
        subtitle: {
          // text: 'by Cadre'
        },
        xAxis: {
          //
          categories: ['Dose 1', 'Dose 2']

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
            name: 'Measles Immunizations',
            data: []
          }

        ]
      },

      seriesname: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      seriesnames: [1, 2],
      seriesnamec: ['MALE', 'FEMALE'],
      seriesdata: [],
      measles: [],
      influenza: [],
      tdap: [],
      meningococcal: [],
      varicella: [],
      disease: [],
      gender: [],
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
    this.getImmunizationsM()
    this.getImmunizationsI()
    this.getImmunizationsT()
    this.getImmunizationsN()
    this.getImmunizationsV()
    this.getAllImmunizations()
    this.getFacilities()
    this.getCounties()
  },
  methods: {
    click () {
      let exp = [], exp1 = [], exp2 = [], exp3 = [], exp4 = [], exp5 = [], exp6 = []
      var dates = {
        convert: function (d) {
          return (
            d.constructor === Date ? d
              : d.constructor === Array ? new Date(d[0], d[1], d[2])
                : d.constructor === Number ? new Date(d)
                  : d.constructor === String ? new Date(d)
                    : typeof d === 'object' ? new Date(d.year, d.month, d.date)
                      : NaN
          )
        },
        inRange: function (d, start, end) {
          return (
            isFinite(d = this.convert(d).valueOf()) &&
            isFinite(start = this.convert(start).valueOf()) &&
            isFinite(end = this.convert(end).valueOf())
              ? start <= d && d <= end
              : NaN
          )
        }
      }
      for (var e in this.n) {
        var i = new Date(this.n[e].created_at).toISOString().substr(0, 10)
        if (dates.inRange(i, this.startDate, this.endDate)) {
          exp.push(this.n[e])
        }
      }
      this.getImmunizationsN(exp)

      for (var e in this.v) {
        var i = new Date(this.v[e].created_at).toISOString().substr(0, 10)
        if (dates.inRange(i, this.startDate, this.endDate)) {
          exp1.push(this.v[e])
        }
      }
      this.getImmunizationsV(exp1)

      for (var e in this.i) {
        var i = new Date(this.i[e].created_at).toISOString().substr(0, 10)
        if (dates.inRange(i, this.startDate, this.endDate)) {
          exp2.push(this.i[e])
        }
      }
      this.getImmunizationsI(exp2)

      for (var e in this.t) {
        var i = new Date(this.t[e].created_at).toISOString().substr(0, 10)
        if (dates.inRange(i, this.startDate, this.endDate)) {
          exp3.push(this.t[e])
        }
      }
      this.getImmunizationsT(exp3)

      for (var e in this.s) {
        var i = new Date(this.s[e].created_at).toISOString().substr(0, 10)
        if (dates.inRange(i, this.startDate, this.endDate)) {
          exp4.push(this.s[e])
        }
      }
      this.getImmunizationsM(exp4)

      for (var e in this.a) {
        var i = new Date(this.a[e].created_at).toISOString().substr(0, 10)
        if (dates.inRange(i, this.startDate, this.endDate)) {
          exp5.push(this.a[e])
        }
      }
      this.getAllImmunizations(exp5)
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
              // console.log(subcounties.data)
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
      this.us_filt = [], this.fac_filt = [], this.exp_filt = [], this.measles_filt = [],
      this.tdap_filt = [], this.vericella_filt = [], this.all_filt = []
      if (a.length > 0) {
        for (var c in a) {
          // console.log(a[c].name)
          for (var f in this.all_facilities) {
            if (this.all_facilities[f].county == a[c].name) {
              this.fac_filt.push(this.all_facilities[f])
            }
          }
          for (var ex in this.n) {
            if (this.n[ex].county == a[c].name) {
              this.exp_filt.push(this.n[ex])
            }
          }
          for (var ex in this.i) {
            if (this.i[ex].county == a[c].name) {
              this.us_filt.push(this.i[ex])
            }
          }
          for (var ex in this.t) {
            if (this.t[ex].county == a[c].name) {
              this.tdap_filt.push(this.t[ex])
            }
          }
          for (var ex in this.s) {
            if (this.s[ex].county == a[c].name) {
              this.measles_filt.push(this.s[ex])
            }
            for (var ex in this.v) {
              if (this.v[ex].county == a[c].name) {
                this.vericella_filt.push(this.v[ex])
              }
            }
            for (var ex in this.a) {
              if (this.a[ex].county == a[c].name) {
                this.all_filt.push(this.a[ex])
              }
            }
          }
        }
        this.getMeningococcal(this.exp_filt)
        this.getInfluenza(this.us_filt)
        this.getAllDiseases(this.all_filt)
        this.getVaricella(this.vericella_filt)
        this.getMeasles(this.measles_filt)
        this.getMeaslesCount(this.measles_filt)
        this.getTDAP(this.tdap_filt)
        this.fac = this.fac_filt.sort()
      } else {
        this.fac = this.all_facilities
        this.getMeningococcal(this.n)
        this.getInfluenza(this.i)
        this.getAllDiseases(this.a)
        this.getVaricella(this.v)
        this.getMeasles(this.s)
        this.getMeaslesCount(this.s)
        this.getTDAP(this.t)
      }
    },
    facilitySubCounty (a) {
      this.exp_filtl = [], this.fac_filtl = [], this.measles_filtl = [], this.us_filtl = [],
      this.tdap_filtl = [], this.vericella_filtl = [], this.all_filtl = []
      this.active_level = false
      if (a.length > 0) {
        for (var c in a) {
          // console.log(a[c].name)
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
          for (var ex in this.measles_filt) {
            if (this.measles_filt[ex].sub_county == a[c].name) {
              this.measles_filtl.push(this.measles_filt[ex])
            }
          }
          for (var ex in this.us_filt) {
            if (this.us_filt[ex].sub_county == a[c].name) {
              this.us_filtl.push(this.us_filt[ex])
            }
          }
          for (var ex in this.vericella_filt) {
            if (this.vericella_filt[ex].sub_county == a[c].name) {
              this.vericella_filtl.push(this.vericella_filt[ex])
            }
          }
          for (var ex in this.tdap_filt) {
            if (this.tdap_filt[ex].sub_county == a[c].name) {
              this.tdap_filtl.push(this.tdap_filt[ex])
            }
          }
          for (var ex in this.all_filt) {
            if (this.all_filt[ex].sub_county == a[c].name) {
              this.all_filtl.push(this.all_filt[ex])
            }
          }
        }
        this.getMeningococcal(this.exp_filtl)
        this.getInfluenza(this.us_filtl)
        this.getAllDiseases(this.all_filtl)
        this.getVaricella(this.vericella_filtl)
        this.getMeasles(this.measles_filtl)
        this.getMeaslesCount(this.measles_filtl)
        this.getTDAP(this.tdap_filtl)

        this.fac = this.fac_filtl.sort()
      } else {
        this.fac = this.fac_filt
        //  this.getTest(this.us_filt)
        this.getMeningococcal(this.exp_filt)
        this.getInfluenza(this.us_filt)
        this.getAllDiseases(this.all_filt)
        this.getVaricella(this.vericella_filt)
        this.getMeasles(this.measles_filt)
        this.getMeaslesCount(this.measles_filt)
        this.getTDAP(this.tdap_filt)
        this.active_level = true
      }
    },

    facilityLevel (a) {
      this.fac_filtf = [], this.exp_filtf = [], this.measles_filtf = [], this.us_filtf = [],
      this.tdap_filtf = [], this.vericella_filtf = [], this.all_filtf = []
      this.active_fac = false
      console.log(a)
      if (a.length > 0) {
        for (var c in a) {
          for (var f in this.fac_filtl) {
            if (this.fac_filtl[f].level == a[c]) {
              this.fac_filtf.push(this.fac_filtl[f])
            } else if (a[c] == 'Level 5 and Above') {
              if (Number(this.fac_filtl[f].level.slice(6, 7)) >= 5) {
                this.fac_filtf.push(this.fac_filtl[f])
              }
            }
          }
          for (var ex in this.exp_filtl) {
            if (this.exp_filtl[ex].facility_level == a[c]) {
              this.exp_filtf.push(this.exp_filtl[ex])
            } else if (a[c] == 'Level 5 and Above') {
              if (Number(this.exp_filtl[ex].facility_level.slice(6, 7)) >= 5) {
                this.exp_filtf.push(this.exp_filtl[ex])
              }
            }
          }
          for (var ex in this.measles_filtl) {
            if (this.measles_filtl[ex].facility_level == a[c]) {
              this.measles_filtf.push(this.measles_filtl[ex])
            } else if (a[c] == 'Level 5 and Above') {
              if (Number(this.measles_filtl[ex].facility_level.slice(6, 7)) >= 5) {
                this.measles_filtf.push(this.measles_filtl[ex])
              }
            }
          }
          for (var ex in this.vericella_filtl) {
            if (this.vericella_filtl[ex].facility_level == a[c]) {
              this.vericella_filtf.push(this.vericella_filtl[ex])
            } else if (a[c] == 'Level 5 and Above') {
              if (Number(this.vericella_filtl[ex].facility_level.slice(6, 7)) >= 5) {
                this.vericella_filtf.push(this.vericella_filtl[ex])
              }
            }
          }
          for (var ex in this.tdap_filtl) {
            if (this.tdap_filtl[ex].facility_level == a[c]) {
              this.tdap_filtf.push(this.tdap_filtl[ex])
            } else if (a[c] == 'Level 5 and Above') {
              if (Number(this.tdap_filtl[ex].facility_level.slice(6, 7)) >= 5) {
                this.tdap_filtf.push(this.tdap_filtl[ex])
              }
            }
          }
          for (var ex in this.us_filtl) {
            if (this.us_filtl[ex].facility_level == a[c]) {
              this.us_filtf.push(this.us_filtl[ex])
            } else if (a[c] == 'Level 5 and Above') {
              if (Number(this.us_filtl[ex].facility_level.slice(6, 7)) >= 5) {
                this.us_filtf.push(this.us_filtl[ex])
              }
            }
          }
          for (var ex in this.all_filtl) {
            if (this.all_filtl[ex].facility_level == a[c]) {
              this.all_filtf.push(this.all_filtl[ex])
            } else if (a[c] == 'Level 5 and Above') {
              if (Number(this.all_filtl[ex].facility_level.slice(6, 7)) >= 5) {
                this.all_filtf.push(this.all_filtl[ex])
              }
            }
          }
        }
        this.getMeningococcal(this.exp_filtf)
        this.getInfluenza(this.us_filtf)
        this.getAllDiseases(this.all_filtf)
        this.getVaricella(this.vericella_filtf)
        this.getMeasles(this.measles_filtf)
        this.getMeaslesCount(this.measles_filtf)
        this.getTDAP(this.tdap_filtf)
        this.fac = this.fac_filtf.sort()
      } else {
        this.fac = this.fac_filtl
        this.active_fac = true
        this.getMeningococcal(this.exp_filtl)
        this.getInfluenza(this.us_filtl)
        this.getAllDiseases(this.all_filtl)
        this.getVaricella(this.vericella_filtl)
        this.getMeasles(this.measles_filtl)
        this.getMeaslesCount(this.measles_filtl)
        this.getTDAP(this.tdap_filtl)
      }
    },

    facilityFilter (a) {
      let g = [], e = [], us = [], h = [], j = [], k = []

      if (a.length > 0) {
        for (var c in a) {
          for (var ex in this.exp_filtf) {
            if (this.exp_filtf[ex].facility_name == a[c].name) {
              e.push(this.exp_filtf[ex])
            }
          }
          for (var u in this.us_filtf) {
            if (this.us_filtf[u].facility_name == a[c].name) {
              us.push(this.us_filtf[u])
            }
          }
          for (var ux in this.measles_filtf) {
            if (this.measles_filtf[ux].facility_name == a[c].name) {
              g.push(this.measles_filtf[ux])
            }
          }
          for (var vx in this.vericella_filtf) {
            if (this.vericella_filtf[vx].facility_name == a[c].name) {
              j.push(this.vericella_filtf[vx])
            }
          }
          for (var tx in this.tdap_filtf) {
            if (this.tdap_filtf[tx].facility_name == a[c].name) {
              h.push(this.tdap_filtf[tx])
            }
          }
          for (var ax in this.all_filtf) {
            if (this.all_filtf[u].facility_name == a[c].name) {
              k.push(this.all_filtf[u])
            }
          }
        }
        // this.getTest(us)
        this.getMeningococcal(e)
        this.getInfluenza(us)
        this.getAllDiseases(k)
        this.getVaricella(j)
        this.getMeasles(g)
        this.getMeaslesCount(g)
        this.getTDAP(h)
      } else {
        // this.getTest(this.us_filtf)
        this.getMeningococcal(this.exp_filtf)
        this.getInfluenza(this.us_filtf)
        this.getAllDiseases(this.all_filtf)
        this.getVaricella(this.vericella_filtf)
        this.getMeasles(this.measles_filtf)
        this.getMeaslesCount(this.measles_filtf)
        this.getTDAP(this.tdap_filtf)
      }
    },
    getAllImmunizations () {
      axios.get('immunizations/all')
        .then((exp) => {
          this.a = exp.data.data
          this.link = exp.data.links.next
          this.loopA(this.link)
        })
        .catch(error => console.log(error.message))
    },
    getImmunizationsM () {
      axios.get('immunizations/all/disease/4')
        .then((exp) => {
          this.s = exp.data.data
          this.link = exp.data.links.next
          this.loopT(this.link)
        })
        .catch(error => console.log(error.message))
    },
    getImmunizationsI () {
      axios.get('immunizations/all/disease/2')
        .then((exp) => {
          this.i = exp.data.data
          this.link = exp.data.links.next
          this.loopI(this.link)
        })
        .catch(error => console.log(error.message))
    },
    getImmunizationsT () {
      axios.get('immunizations/all/disease/3')
        .then((exp) => {
          this.t = exp.data.data
          this.link = exp.data.links.next
          this.loopTD(this.link)
        })
        .catch(error => console.log(error.message))
    },
    getImmunizationsN () {
      if (this.user.role_id === 1 || this.user.role_id == 5) {
        axios.get('immunizations/all/disease/5')
          .then((exp) => {
            this.n = exp.data.data
            if (exp.data.links.next != null) {
              this.link = exp.data.links.next
              this.loopN(this.link)
            } else {
              this.getMeningococcal(this.n)
            }
          })
          .catch(error => console.log(error.message))
      } else if (this.user.role_id === 4) {
        axios.get(`immunizations/facility/${this.user.hcw.facility_id}/disease/5`)
          .then((exp) => {
            this.n = exp.data.data
            if (exp.data.links.next != null) {
              this.link = exp.data.links.next
              this.loopN(this.link)
            } else {
              this.getMeningococcal(this.n)
            }
          })
          .catch(error => console.log(error.message))
      }
    },
    getImmunizationsV () {
      axios.get('immunizations/all/disease/6')
        .then((exp) => {
          this.v = exp.data.data
          this.link = exp.data.links.next
          this.loopV(this.link)
        })
        .catch(error => console.log(error.message))
    },
    getAllDiseases (list) {
      var count = 0
      for (var i in this.AllDiseaseschartOptions.series) {
        this.seriesdata = []
        for (var v in this.AllDiseaseschartOptions.xAxis.categories) {
          this.seriesdata.push(this.getNumAll(this.AllDiseaseschartOptions.xAxis.categories[v], this.AllDiseaseschartOptions.series[i].name[0], list))
          count += this.getNumAll(this.AllDiseaseschartOptions.xAxis.categories[v], this.AllDiseaseschartOptions.series[i].name[0], list)
        }
        this.AllDiseaseschartOptions.series[i].data = this.seriesdata
      }
    },
    getMeasles (list) {
      this.seriesdata = []
      for (var vac in this.seriesname) {
        this.seriesdata.push(this.getNumn(this.seriesname[vac], list))
      }
      this.MeaslesChartOptions.series[0].data = this.seriesdata
    },
    getMeaslesCount (list) {
      this.seriesdata = []
      for (var vac in this.seriesnames) {
      this.seriesdata.push(this.getNumCount(vac, list))
      }
      this.CountMeaslesChartOptions.series[0].data = this.seriesdata
    },
    getInfluenza (list) {
      this.seriesdata = []
      for (var vac in this.seriesname) {
        this.seriesdata.push(this.getNumt(this.seriesname[vac], list))
      }
      this.InfluenzaChartOptions.series[0].data = this.seriesdata
    },
    getTDAP (list) {
      this.seriesdata = []
      for (var vac in this.seriesname) {
        this.seriesdata.push(this.getNumt(this.seriesname[vac], list))
      }
      this.TDAPChartOptions.series[0].data = this.seriesdata
    },
    getVaricella (list) {
      this.seriesdata = []
      for (var vac in this.seriesname) {
        this.seriesdata.push(this.getNumn(this.seriesname[vac], list))
      }
      this.VaricellaChartOptions.series[0].data = this.seriesdata
    },
    getMeningococcal (list) {
      this.seriesdata = []
      for (var vac in this.seriesname) {
        this.seriesdata.push(this.getNumn(this.seriesname[vac], list))
      }
      this.MeningococcalChartOptions.series[0].data = this.seriesdata
    },

    getNumAll (gender, disease, list) {
      var count = 0
      for (var x in list) {
        // console.log(this.s[x].type)
        if (list[x].gender === gender && list[x].disease === disease) {
          count++
        }
      }
      return count
    },

    getNum (name) {
      var counter = 0
      for (var xo in this.s) {
        if (this.s[xo].date.slice(0, 3) === name) {
          counter++
          console.log(this.s[xo].date.slice(0, 3))
        }
      }
      return counter
    },

    getNumi (name, l) {
      var counter = 0
      for (var xo in l) {
        if (l[xo].date.slice(0, 3) === name) {
          counter++
        }
      }
      return counter
    },

    getNumt (name, list) {
      var counter = 0
      for (var xo in list) {
        if (list[xo].date.slice(0, 3) === name) {
          counter++
        }
      }
      return counter
    },

    getNumn (name, list) {
      var counter = 0
      for (var xo in list) {
        if (list[xo].date.slice(0, 3) === name) {
          counter++
        }
      }
      return counter
    },
    getNumv (name) {
      var counter = 0
      for (var xo in this.v) {
        if (this.v[xo].date.slice(0, 3) === name) {
          counter++
        }
      }
      return counter
    },
    getNumCount (name, list) {
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
      }
      for (var u in b) {
        if (b[u] === 1 && name == 0) {
          count++
        } else if (name == 1 && b[u] === 2) {
          count++
        }console.log(a)
      }
      return count
    },

    handleDownload () {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['First Name', 'Surname', 'Gender','Phone Number','Disease Name', 'Date', 'County', 'Sub County', 'Facility Name','Facility Level']
        const filterVal = ['first_name', 'surname','gender', 'msisdn', 'disease', 'date', 'county', 'sub_county', 'facility_name', 'facility_level']
        const list = this.a
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
    },

    async loopA (l) {
      var i
      for (i = 0; i < 1;) {
        if (l != null) {
          let response = await axios.get(l)
          l = response.data.links.next
          this.a = this.a.concat(response.data.data)
          this.getAllDiseases(this.a)
        } else {
          i = 11
        }
      }
      this.getAllDiseases(this.a)
      this.isLoading = false
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
      this.getMeasles(this.s)
      this.getMeaslesCount(this.s)
    },

    async loopI (l) {
      var i
      for (i = 0; i < 1;) {
        if (l != null) {
          let response = await axios.get(l)
          l = response.data.links.next
          this.i = this.i.concat(response.data.data)
        } else {
          i = 11
        }
      }

      this.getInfluenza(this.i)
    },

    async loopTD (l) {
      var i
      for (i = 0; i < 1;) {
        if (l != null) {
          let response = await axios.get(l)
          l = response.data.links.next

          this.t = this.t.concat(response.data.data)
        } else {
          i = 11
        }
      }

      this.getTDAP(this.t)
    },

    async loopN (l) {
      var i
      for (i = 0; i < 1;) {
        if (l != null) {
          let response = await axios.get(l)
          l = response.data.links.next
          this.n = this.n.concat(response.data.data)
        } else {
          i = 11
        }
      }
      this.getMeningococcal(this.n)
    },

    async loopV (l) {
      var i
      for (i = 0; i < 1;) {
        if (l != null) {
          let response = await axios.get(l)
          l = response.data.links.next

          this.v = this.v.concat(response.data.data)
        } else {
          i = 11
        }
      }

      this.getVaricella(this.v)
    }
  }
}
// end
</script>

<style>
.v-btn {
  margin-right: 130px;
}


</style>
