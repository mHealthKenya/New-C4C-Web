<template>
  <v-card>
    <v-container
      fill-height
      fluid
      grid-list-xl
      py-0>
      <v-layout
        justify-center
        wrap>
        <v-flex
          v-if="user.role_id === 1 || user.role_id === 2"
          xs12
          md2
        >
          <template>
            <v-combobox
oom
zoo              :items="all_counties"
              item-text="name"
              item-value="id"
              label="Select County"
              multiple
              clearable
              persistent-hint
              chips
              @change="getSubCounties"/>
          </template>
        </v-flex>
        <v-flex
          v-if="user.role_id !== 4"
          xs12
          md3
        >
          <template>
            <v-combobox
              v-model="subcounties"
              :items="all_subcounties"
              :disabled="active"
              item-text="name"
              item-value="id"
              label="Select Sub-County"
              multiple
              clearable
              persistent-hint
              chips
              @change="getFacilitysubcountyfilter"/>
          </template>
        </v-flex>
        <v-flex
          v-if="user.role_id !== 4"
          xs12
          md2
        >
          <template>
            <v-combobox
              v-if="user.role_id !== 4"
              v-model="partner"
              item-text="partner"
              item-value="id"
              label="Select Partner"
              multiple
              disabled
              clearable
              persistent-hint
              chips/>
          </template>
        </v-flex>
        <v-flex
          v-if="user.role_id !== 4"
          xs12
          md2
        >
          <template>
            <v-combobox
              :items="all_facilities_level"
              :disabled="active_level"
              label="Select Facility Level"
              multiple
              clerable
              persistent-hint
              chips
              @change="getFacilitylevelfilter"/>
          </template>
        </v-flex>
        <v-flex
          v-if="user.role_id !== 4"
          xs12
          md3
        >
          <v-combobox
            v-model="facility"
            :items="fac"
            item-text="name"
            item-value="id"
            label="Select Facility"
            multiple
            clearable
            persistent-hint
            chips
            @change="getFacilityfilter"/>
        </v-flex>
        <template>
          <v-flex
            v-if="user.role_id === 4"
            xs12
            md2
          >
            <v-combobox
              :items="cadres"
              item-text="name"
              item-value="id"
              label="Select Cadre"
              multiple
              clearable
              persistent-hint
              chips
              @change="cadreFilter"/>
          </v-flex>
          <v-flex
            xs12
            md2>
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
                :max="endDate"
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
                  @click="click();$refs.menu1.save(startDate);click">OK</v-btn>
              </v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex
            xs12
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
                :min="startDate"
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
                  @click="click();$refs.menu.save(endDate)">OK</v-btn>
              </v-date-picker>
            </v-menu>
          </v-flex>
        </template>
      </v-layout>
    </v-container>
    <!-- End filters -->

    <v-tabs
      color="teal lighten-5"
      centered
    >
      <v-tab>Summary Report</v-tab>
      <v-tab>Report By Type</v-tab>
      <v-tab>Report By Location</v-tab>
      <v-tab>Report By Device</v-tab>
      <v-tab>Report By Cadre</v-tab>
      <v-tab>Report By Month</v-tab>
      <v-tab>Report By Age</v-tab>
      <v-tab>Report By Hours</v-tab>
      <v-tab>Report By Gender</v-tab>
      <v-tab-item
        v-for="n in 9"
        :key="n">
        <v-container fluid>
          <v-card-text v-if="n===1">
            <!-- Start Graphs -->
            <v-container py-0>
              <v-layout wrap>
                <v-flex
                  xs12
                  md12
                  >
                  <div class="card vld-parent">
                    <loading
                      :active.sync="isLoading"
                      :can-cancel="false"
                      :is-full-page="false"
                      loader="bars"
                      color="#007bff"/>
                    <highcharts
                      ref="barChart"
                      :options="barOptionsTime"/>
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <!-- Start Exposure Type -->
          <v-card-text v-if="n===2">
            <div class="card vld-parent">
              <loading
                :active.sync="isLoading"
                :can-cancel="false"
                :is-full-page="false"
                loader="bars"
                color="#007bff"/>
              <highcharts
                ref="barChart"
                :options="barOptions"/>
            </div>
          </v-card-text>

          <!-- Start Exposure Location -->

          <v-card-text v-if="n===3">
            <div class="card vld-parent">
              <loading
                :active.sync="isLoading"
                :can-cancel="false"
                :is-full-page="false"
                loader="bars"
                color="#007bff"/>
              <highcharts
                ref="barChart"
                :options="barOptionsLocation"/>
            </div>
          </v-card-text>

          <!-- Start Exposure Devices -->

          <v-card-text v-if="n===4">
            <div class="card vld-parent">
              <loading
                :active.sync="isLoading"
                :can-cancel="false"
                :is-full-page="false"
                loader="bars"
                color="#007bff"/>
              <highcharts
                ref="barChart"
                :options="barOptionsDevice"/>
            </div>
          </v-card-text>

          <!-- Start Exposure Cadre -->

          <v-card-text v-if="n===5">
            <div class="card vld-parent">
              <loading
                :active.sync="isLoading"
                :can-cancel="false"
                :is-full-page="false"
                loader="bars"
                color="#007bff"/>
              <highcharts
                ref="barChart"
                :options="barOptionsCadre"/>
            </div>
          </v-card-text>

          <!-- Start Exposure Time -->
          <v-card-text v-if="n===6">
            <div class="card vld-parent">
              <loading
                :active.sync="isLoading"
                :can-cancel="false"
                :is-full-page="false"
                loader="bars"
                color="#007bff"/>
              <highcharts
                ref="barChart"
                :options="barOptionsTime"/>
            </div>
          </v-card-text>

          <!--Start Exposure Age -->
          <v-card-text v-if="n===7">
            <div class="card vld-parent">
              <loading
                :active.sync="isLoading"
                :can-cancel="false"
                :is-full-page="false"
                loader="bars"
                color="#007bff"/>
              <highcharts
                ref="barChart"
                :options="barOptionsAge"/>
            </div>
          </v-card-text>

          <!-- Start Exposure Hour -->

          <v-card-text v-if="n===8">
            <div class="card vld-parent">
              <loading
                :active.sync="isLoading"
                :can-cancel="false"
                :is-full-page="false"
                loader="bars"
                color="#007bff"/>
              <highcharts
                ref="barChart"
                :options="barOptionsHour"/>
            </div>
          </v-card-text>

          <!-- Start Gender -->
          <v-card-text v-if="n==9">
            <div class="card vld-parent">
              <loading
                :active.sync="isLoading"
                :can-cancel="false"
                :is-full-page="false"
                loader="bars"
                color="#007bff"/>
              <highcharts
                ref="barChart"
                :options="gendOptions"/>
            </div>
          </v-card-text>
        </v-container>
      </v-tab-item>
    </v-tabs>
  </v-card>

</template>

<script>
import { Chart } from 'highcharts-vue'
import Highcharts from 'highcharts'
import exportingInit from 'highcharts/modules/exporting'
import axios from 'axios'
import { mapGetters, mapState } from 'vuex'
import moment from 'moment'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

// SeriesLabel(Highcharts);
exportingInit(Highcharts)

export default {

  computed: {
    cadreCount () {
      return this.c
    },

    ...mapGetters({
      user: 'auth/user'
    })
  },
  components: { highcharts: Chart, Loading },
  data () {
    return {
      isLoading: true,
      partner: [],
      cadres: [],
      facility: '',
      counties: '',
      subcounties: '',
      all_facilities_level: ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5 and Above'],
      all_facilities: [],
      all_subcounties: [],
      all_counties: [],
      fac: [],
      active: true,
      active_fac: true,
      active_level: true,
      menu: false,
      menu1: false,
      startDate: '2017-01-01',
      maxDate: new Date().toISOString().substr(0, 10),
      minDate: '2017-01-01',
      endDate: new Date().toISOString().substr(0, 10),
      value: true,
      value1: true,
      gendOptions: {
        xAxis: {
          categories: ['MALE', 'FEMALE', 'UNDEFINED'],
          title: {
            text: 'Gender'
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'No. of Exposures',
            align: 'high'
          },
          labels: {
            overflow: 'justify',
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
          }
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true
            }
          }
        },
        chart: {
          type: 'column'
        },
        title: {
          text: 'Exposure by Gender'
        },
        series: [
          {
            colorByPoint: true,
            name: 'Numbers',
            data: [],
           
          }
        ]
      },
      // devices starts

      barOptionsDevice: {
        xAxis: {
          categories: ['Capillary tube', 'Glass slide', 'IV catheter/canula', 'Lancet', 'Needle on IV-line', 'Phlebotomy needle/vacuum set', 'Pippete tip', 'Sature needle', 'Scalpel', 'Syringe /needle blood drawing', 'syringe/needle IM/SC injection', 'Unused needle', 'Other', 'Not Specified'],
          title: {
            text: 'Devices'
          }
        },

        yAxis: {
          min: 0,
          title: {
            text: 'No. of Exposures',
            align: 'high'
          },
          labels: {
            overflow: 'justify',
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
          }
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true
            }
          }
        },
        chart: {
          type: 'column'
        },
        title: {
          text: 'Exposures by Devices'
        },
        series: [
          {
            colorByPoint: true,
            name: 'Numbers',
            data: []
          }
        ]
      },

      barOptionsAge: {
        xAxis: {
          categories: ['18 - 25', '26 - 35', '36 - 45', '46 - 55', '56 - 65', '65 and Above', 'undefined'],
          title: {
            text: 'Age Groups'
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'No. of Exposures',
            align: 'high'
          },
          labels: {
            overflow: 'justify',
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
          }
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true
            }
          }
        },
        chart: {
          type: 'column'
        },
        title: {
          text: 'Exposures by Age'
        },
        series: [
          {
            colorByPoint: true,
            name: 'Numbers',
            data: []
          }
        ]
      },

      // stats
      barOptionsHour: {
        xAxis: {
          categories: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '00' ],
          title: {
            text: 'Hours Range'
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'No. of Exposures',
            align: 'high'
          },
          labels: {
            overflow: 'justify',
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
          }
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true
            }
          }
        },
        chart: {
          type: 'column'
        },
        title: {
          text: 'Exposures by Hours'
        },
        series: [
          {
            colorByPoint: true,
            name: 'Numbers',
            data: []
          }
        ]
      },

      barOptionsTime: {
        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          title: {
            text: 'Year -  Month'
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'No. of Exposures',
            align: 'high'
          },
          labels: {
            overflow: 'justify',
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
          }
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true
            }
          }
        },
        chart: {
          type: 'column'
        },
        title: {
          text: 'Exposures Report by Months'
        },
        series: [
          {
            colorByPoint: true,
            name: 'Numbers',
            data: []
          }
        ]
      },

      barOptionsCadre: {
        xAxis: {
          categories: ['Cleaner', 'Clinical officer', 'Doctor', 'Laboratory Technologist', 'Nurse', 'Other-Specify', 'Student', 'VCT Counsellor', 'Waste Handler'],
          title: {
            text: 'Cadre'
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'No. of Exposures',
            align: 'high'
          },
          labels: {
            overflow: 'justify',
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
          }
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true
            }
          }
        },
        chart: {
          type: 'column'
        },
        title: {
          text: 'Exposures by Cadre'
        },
        series: [
          {
            colorByPoint: true,
            name: 'Numbers',
            data: []
          }
        ]
      },

      barOptions: {
        xAxis: {
          categories: ['Bite', 'Cuts', 'Needle Stick', 'Non-Intact Skin', 'Splash on Mucosa', 'Other'],
          title: {
            text: 'Exposure Type'
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'No. of Exposures',
            align: 'high'
          },
          labels: {
            overflow: 'justify',
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
          }
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true
            }
          }
        },
        chart: {
          type: 'column'
        },
        title: {
          text: 'Exposures by Type'
        },
        series: [
          {
            colorByPoint: true,
            name: 'Numbers',
            data: []
          }
        ]
      },

      barOptionsLocation: {
        xAxis: {
          categories: ['Dental clinic', 'Laboratory', 'Laundry', 'Maternity', 'Medical ward', 'OP/MCH', 'Surgical ward', 'Theater', 'Other'],
          title: {
            text: 'Exposure Location'
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'No. of Exposures',
            align: 'high'
          },
          labels: {
            overflow: 'justify',
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
          }
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true
            }
          }
        },
        chart: {
          type: 'column'
        },
        title: {
          text: 'Exposures by Location'
        },
        series: [
          {
            colorByPoint: true,
            name: 'Numbers',
            data: []
          }
        ]
      },
      s: [],
      type: [],
      cadre: [],
      dob: [],
      date: [],
      users: [],
      gender: [],
      hours: [],
      load: true,
      fac_filt: [],
      fac_filtl: [],
      fac_filtf: [],
      exp_filt: [],
      exp_filtl: [],
      exp_filtf: []
    }
  },

  created () {
    this.getFacilities()
    this.getExp()
    this.getCad()
    this.getCounties()
    this.dateRange('2020-01-20', this.endDate)
    // this.getExpo()
  },
  methods: {
    getFacilities () {
      axios.get('facilities')
        .then((facilities) => {
          this.all_facilities = facilities.data.data
          if (this.user.role_id === 5) {
            this.subCounties()
          }
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
    subCounties () {
      axios.get('counties')
        .then((counties) => {
          for (var x in counties.data.data) {
            if (this.user.hcw.county === counties.data.data[x].name) {
              this.getSubCounties([counties.data.data[x]])
              console.log(counties.data.data[x])
            }
          }
        })
        .catch(error => console.log(error.message))
    },

    getSubCounties (a) {
      //console.log(a)
      if (a.length > 0) {
        this.active = false
        this.all_subcounties = []
        for (var x in a) {
          axios.get(`subcounties/${a[x].id}`)
            .then((subcounties) => {
              this.all_subcounties = this.all_subcounties.concat(subcounties.data.data)
            })
            .catch(error => console.log(error.message))
        }
        this.getFacilitycountyfilter(a)
      } else {
        this.active = true
        this.getFacilitycountyfilter(a)
      }
    },

    getFacilitycountyfilter (a) {
      this.fac_filt = []
      this.exp_filt = []
      if (a.length > 0) {
        for (var c in a) {
          for (var ai in this.all_facilities) {
            if (this.all_facilities[ai].county === a[c].name) {
              this.fac_filt.push(this.all_facilities[ai])
            }
          }
          for (var e in this.s) {
            if (this.s[e].county === a[c].name) {
              this.exp_filt.push(this.s[e])
            }
          }
        }
        this.getAgeData(this.exp_filt)
        this.fac = this.fac_filt.sort()
      } else {
        this.getAgeData(this.s)
        this.fac = this.all_facilities
      }
    },
    getFacilitysubcountyfilter (fsb) {
      this.exp_filtl = []
      this.fac_filtl = []
      this.active_level = false
      if (fsb.length > 0) {
        for (var sb in fsb) {
          for (var a in this.fac_filt) {
            if (this.fac_filt[a].sub_county === fsb[sb].name) {
              this.fac_filtl.push(this.fac_filt[a])
            }
          }
          for (var e in this.exp_filt) {
            if (this.exp_filt[e].sub_county === fsb[sb].name) {
              this.exp_filtl.push(this.exp_filt[e])
            }
          }
        }

        this.getAgeData(this.exp_filtl)
        this.fac = this.fac_filtl.sort()
      } else {
        this.getAgeData(this.exp_filt)
        this.fac = this.fac_filt
        this.active_level = true
      }
    },

    getFacilitylevelfilter (fl) {
      this.fac_filtf = [], this.exp_filtf = []
      this.active_fac = false
      if (fl.length > 0) {
        for (var l in fl) {
          for (var a in this.fac_filtl) {
            if (this.fac_filtl[a].level == fl[l]) {
              this.fac_filtf.push(this.fac_filtl[a])
            } else if (fl[l] === 'Level 5 and Above') {
              if (Number(this.fac_filtl[a].level.slice(6, 7)) >= 5) {
                this.fac_filtf.push(this.fac_filtl[a])
              }
            }
          }
          for (var e in this.exp_filtl) {
            if (this.exp_filtl[e].facility_level === fl[l]) {
              this.exp_filtf.push(this.exp_filtl[e])
            } else if (fl[l] === 'Level 5 and Above') {
              if (Number(this.exp_filtl[e].facility_level.slice(6, 7)) >= 5) {
                this.exp_filtf.push(this.exp_filtl[e])
              }
            }
          }
        }

        this.getAgeData(this.exp_filtf)
        this.fac = this.fac_filtf.sort()
      } else {
        this.getAgeData(this.exp_filtl)
        this.fac = this.fac_filtl
        this.active_fac = true
      }
    },

    getFacilityfilter (f) {
      let exp = []
      if (f.length > 0) {
        for (var s in f) {
          for (var e in this.exp_filtf) {
            if (this.exp_filtf[e].facility === f[s].name) {
              exp.push(this.exp_filtf[e])
            }
          }
        }
        this.getAgeData(exp)
      } else {
        this.getAgeData(this.exp_filtf)
      }
    },

    cadreFilter (a) {
      this.fac_filt = [], this.exp_filt = []
      if (a.length > 0) {
        for (var e in this.s) {
          if (this.s[e].county === a[c].name) {
            this.exp_filt.push(this.s[e])
          }
        }
        this.getAgeData(this.exp_filt)
      } else {
        this.getAgeData(this.s)
      }
    },

    click () {
      let expo = []
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
      for (var e in this.s) {
        var i = new Date(this.s[e].created_at).toISOString().substr(0, 10)
        if (dates.inRange(i, this.startDate, this.endDate)) {
          expo.push(this.s[e])
        }
      }
      this.getAgeData(expo)
    },

    getExp () {
      if (this.user.role_id === 1 || this.user.role_id === 2 || this.user.role_id === 5) {
        axios.get(`exposures/all`)
          .then((response) => {
            this.s = response.data.data
            if (response.data.links.next != null) {
              this.link = response.data.links.next
              // this.c = exp.data.cadre.meta.total // total cadre
              this.loopT(this.link)
            } else {
              this.getAgeData(this.s)
            }
          })
          .catch(error => console.log(error.message))
      } else if (this.user.role_id === 4) {
        axios.get(`exposures/facility/${this.user.hcw.facility_id}`)
          .then((exp) => {
            this.s = exp.data.data
            if (exp.data.links.next != null) {
              this.link = exp.data.links.next
              // this.c = exp.data.cadre.meta.total // total cadre
              this.loopT(this.link)
            } else {
              this.getAgeData(this.s)
            }
          })
          .catch(error => console.log(error.message))
      }
    },

    getCad () {
      axios.get('cadres')
        .then((cad) => {
          this.cadres = cad.data.data
        })
        .catch(error => console.log(error.message))
    },

    async loopT (l) {
      var i; var u = []
      for (i = 0; i < 1;) {
        if (l != null) {
          let response = await axios.get(l)
          l = response.data.links.next
          this.s = this.s.concat(response.data.data)
        } else {
          i = 11
        }
      }
      if (this.user.role_id === 5) {
        this.active = false
        for (var i in this.s) {
          if (this.s[i].county == this.user.county) {
            u.push(this.s[i])
          }
        }
        this.s = u
      }
      this.getAgeData(this.s)
      this.isLoading = false
    },

    getAgeData (list) {
      this.load = true
      var data = []
      for (var i in this.barOptionsAge.xAxis.categories) {
        data.push(this.getAgeNum(i, list))
      }
      this.barOptionsAge.series[0].data = data
      this.value = false
      this.load = false

      this.load = true
      var data = []
      for (var i in this.gendOptions.xAxis.categories) {
        data.push(this.getGend(this.gendOptions.xAxis.categories[i], list))
      }
      this.gendOptions.series[0].data = data
      this.value1 = false
      this.load = false

      this.load = true
      var data = []
      for (var i in this.barOptionsDevice.xAxis.categories) {
        data.push(this.getDevice(this.barOptionsDevice.xAxis.categories[i], list))
      }
      this.barOptionsDevice.series[0].data = data
      this.value1 = false
      this.load = false

      this.load = true
      var datac = []
      for (var i in this.barOptionsCadre.xAxis.categories) {
        datac.push(this.getNumc(this.barOptionsCadre.xAxis.categories[i], list))
      }
      this.barOptionsCadre.series[0].data = datac
      this.load = false

      this.load = true
      var data = []
      for (var i in this.barOptionsLocation.xAxis.categories) {
        data.push(this.getNum(this.barOptionsLocation.xAxis.categories[i], list))
      }
      this.barOptionsLocation.series[0].data = data
      this.load = false

      this.load = true
      var data = []
      for (var i in this.barOptions.xAxis.categories) {
        data.push(this.getNums(this.barOptions.xAxis.categories[i], list))
      }
      this.barOptions.series[0].data = data
      this.valuet = false
      this.load = false

      this.load = true
      var data = []
      for (var i in this.barOptionsHour.xAxis.categories) {
        data.push(this.getNumh(this.barOptionsHour.xAxis.categories[i], list))
      }
      this.barOptionsHour.series[0].data = data
      this.load = false

      this.load = true
      var data = []
      this.barOptionsTime.xAxis.categories = this.dateRange(this.startDate, this.endDate)
      for (var i in this.barOptionsTime.xAxis.categories) {
        data.push(this.getNumt(this.barOptionsTime.xAxis.categories[i], list))
      }
      this.barOptionsTime.series[0].data = data
      this.load = false
    },
    getAgeNum (cat, ag) {
      var count = 0
      for (var x in ag) {
        var date = new Date(ag[x].dob)
        var diff_ms = Date.now() - date.getTime()
        var age_dt = new Date(diff_ms)
        var age = Math.abs(age_dt.getUTCFullYear() - 1970)
        if (age >= 18 && age < 26 && cat == 0) {
          count++
        } else if (age > 25 && age <= 35 && cat == 1) {
          count++
        } else if (age > 35 && age <= 45 && cat == 2) {
          count++
        } else if (age > 45 && age <= 55 && cat == 3) {
          count++
        } else if (age > 55 && age <= 65 && cat == 4) {
          count++
        } else if (age > 65 && cat == 5) {
          count++
        } else if (age < 18 && cat == 6) {
          count++
        } else {
          count
        }
      }
      return count
    },
    getGend (cat, g) {
      var count = 0
      for (var x in g) {
        if (g[x].gender === cat) {
          count++
        }
      }
      return count
    },
    getGp (cat, num, g) {
      var count = 0
      for (var x in g) {
        if (g[x].gender === cat && g[x].gender === num) {
          count++
        }
      }
    },

    getDevice (cat, d) {
      var count = 0
      for (var x in d) {
        if (d[x].device_used === cat) {
          count++
        }
      }
      return count
    },
    getNum (name, exl) {
      var count = 0
      for (var x in exl) {
        if (exl[x].exposure_location === name) {
          count++
        }
      }
      return count
    },
    getNums (cat, ext) {
      var counter = 0
      for (var xo in ext) {
        if (ext[xo].exposure_type === cat) {
          counter++
        }
      }
      return counter
    },
    getNumc (name, c) {
      var counter = 0
      for (var xc in c) {
        if (c[xc].cadre === name) {
          counter++
        }
      }
      return counter
    },
    getNumt (name, expo) {
      var counter = 0
      var c = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      for (var xt in expo) {
        var m = c.indexOf(expo[xt].exposure_date.slice(0, 3)) + 1 
        if (m < 10) { m = '0' + m }
        var d = [expo[xt].exposure_date.slice(8, 13).trim(), m].join('-')
        if (d === name) {
          counter++
        }
      }
      return counter
    },

    getNumsum (name, d) {
      var counter = 0
      for (var xsum in d) {
        if (d[xsum].date.slice(0, 3) === name) {
          counter++
        }
      }
      return counter
    },

    getNumh (name, t) {
      var counter = 0
      for (var xh in t) {
        var hr = t[xh].exposure_date.split(':')[0].slice(-2).trim()

        if (hr < 10) {
          hr = '0' + hr
        }
        if (hr === name) {
          counter++
        }
      }
      return counter
    },
    dateRange (startDate, endDate) {
      var start = startDate.split('-')
      var end = endDate.split('-')
      var startYear = parseInt(start[0])
      var endYear = parseInt(end[0])
      var dates = []

      for (var i = startYear; i <= endYear; i++) {
        var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1
        var startMon = i === startYear ? parseInt(start[1]) - 1 : 0
        for (var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
          var month = j + 1
          var displayMonth = month < 10 ? '0' + month : month
          dates.push([i, displayMonth].join('-'))
        }
      }
      return dates
    }
  }
}
</script>

