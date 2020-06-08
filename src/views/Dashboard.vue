<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
  <v-layout  
    justify-center
      wrap>

  <v-layout  
    justify-center
    v-if="user.role_id === 1 || user.role_id === 2"
    wrap>    


      <!-- Start Cards -->
      <v-flex 
        sm3
        xs8
        md2
        lg2
      >
        <template>
          <v-card
            class="mx-auto"
            color="#4B9FD2"
            dark
          >
            <v-card-text>
              <v-icon class="mr-1" >mdi-account-group</v-icon>
              <h2 align="center">{{ aUsersCount }}</h2>
              <h5 align="center">Healthcare Workers</h5>
            </v-card-text>
          </v-card>
        </template>
      </v-flex>

      <v-flex
        sm3
        xs8
        md2
        lg2
      >
        <template>
          <v-card
            class="mx-auto"
            color="#4B9FD2"
            dark
          >
            <v-card-text>
              <v-icon class="mr-1">mdi-file-chart</v-icon>
              <h2 align="center">{{ exposuresCount }}</h2>
              <h5 align="center">Reported Exposures</h5>
            </v-card-text>
          </v-card>
        </template>
      </v-flex>

      <v-flex
        sm3
        xs8
        md2
        lg2
      >

        <template>
          <v-card
            class="mx-auto"
            color="#4B9FD2"
            dark
          >
            <v-card-text>
              <v-icon class="mr-1">mdi-message</v-icon>
              <h2 align="center">{{ broadcastsCount }}</h2>
              <h5 align="center">Broadcasts Sent </h5>
            </v-card-text>
          </v-card>
        </template>

      </v-flex>

      <v-flex 
        sm3
        xs8
        md2
        lg2
      >
        <template>
          <v-card
            class="mx-auto"
            color="#4B9FD2"
            dark
          >
            <v-card-text>
              <v-icon class="mr-1">mdi-home-outline</v-icon>
              <h2 align="center">{{ all_facilities.length }}</h2>
              <h5 align="center"> Facilities</h5>
            </v-card-text>
          </v-card>
        </template>
      </v-flex>

      <v-flex 
        sm3
        xs8
        md2
        lg2
      >
        <template>
          <v-card
            class="mx-auto"
            color="#4B9FD2"
            dark
          >
            <v-card-text>
              <v-icon class="mr-1">mdi-map-marker</v-icon>
              <h2 align="center">{{ all_counties.length }}</h2>
              <h5 align="center">Counties</h5>
            </v-card-text>
          </v-card>
        </template>
      </v-flex>

      <v-flex 
        sm3
        xs8
        md2
        lg2
      >
        <template>
          <v-card
            class="mx-auto"
            color="#4B9FD2"
            dark
          >
            <v-card-text>
              <v-icon class="mr-1">mdi-account-check</v-icon>
              <h2 align="center">{{ partnerCount }}</h2>
              <h5 align="center">Partners</h5>
            </v-card-text>
          </v-card>
        </template>
      </v-flex>
      <!-- End Cards -->
  </v-layout>

    <v-layout  
    justify-center
    v-else
    wrap> 

      <!-- Start Cards -->

      <v-flex 
        sm3
        xs8
        md4
        lg4
      >
        <template>
          <v-card
            class="mx-auto"
            color="#4B9FD2"
            dark
          >
            <v-card-text>
              <v-icon class="mr-1" >mdi-account-group</v-icon>
              <h2 align="center">{{ usersCount }}</h2>
              <h5 align="center">Total Number Of Users</h5>
            </v-card-text>
          </v-card>
        </template>
      </v-flex>

      <v-flex
        sm3
        xs8
        md4
        lg4
      >
        <template>
          <v-card
            class="mx-auto"
            color="#4B9FD2"
            dark
          >
            <v-card-text>
              <v-icon class="mr-1">mdi-file-chart</v-icon>
              <h2 align="center">{{ exposuresCount }}</h2>
              <h5 align="center">Reported Exposures</h5>
            </v-card-text>
          </v-card>
        </template>
      </v-flex>

      <v-flex
        sm3
        xs8
        md4
        lg4
      >

        <template>
          <v-card
            class="mx-auto"
            color="#4B9FD2"
            dark
          >
            <v-card-text>
              <v-icon class="mr-1">mdi-message</v-icon>
              <h2 align="center">{{ broadcastsCount }}</h2>
              <h5 align="center">Broadcast Messages Sent</h5>
            </v-card-text>
          </v-card>
        </template>

      </v-flex>

      <!-- End Cards -->
    </v-layout>

      <template>
        <!-- Start filters -->

        <v-container py-0>
          <v-layout wrap>
            <v-flex
              xs10
              md2
            >
              <template>
                <v-combobox
                  v-if="user.role_id === 1 || user.role_id === 2"
                  v-model="counties"
                  :items="all_counties"
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
              xs10
              md2
            >
              <template>
                <v-combobox
                  v-if="user.role_id != 4"
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
                  @change="facilitySubCounty"/>

              </template>
            </v-flex>

            <v-flex
              xs10
              md2
            >
              <template>
                <v-combobox
                  v-if="user.role_id != 4"
                  v-model="partner"
                  :items="fac"
                  item-text="partner"
                  item-value="id"
                  label="Select Partner"
                  multiple
                  clearable
                  disabled
                  persistent-hint
                  chips/>

              </template>
            </v-flex>

            <v-flex
              xs10
              md2
            >
              <template>
                <v-combobox
                  v-if="user.role_id != 4"
                  :items="all_facilities_level"
                  :disabled="active_level"
                  label="Select Facility Level"
                  multiple
                  clearable
                  persistent-hint
                  chips
                  @change="facilityLevel"/>

              </template>
            </v-flex>

            <v-flex
              xs10
              md4
            >
              <template>
                <v-combobox
                  v-if="user.role_id != 4"
                  v-model="facility"
                  :items="fac"
                  :disabled="active_fac"
                  item-text="name"
                  item-value="id"
                  label="Select Facility"
                  multiple
                  clearable
                  persistent-hint
                  chips
                  @change="facilityFilter"/>

              </template>
            </v-flex>
          </v-layout>
        </v-container>

        <template>
          <v-flex
            v-if="user.role_id === 4"
            xs10
            md4
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
            sm6
            md2
            lg2>
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
            sm6
            md2
            lg2>
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

        <!-- <v-flex xs12 sm6 md2 lg2>
          <v-btn
            block
            color="secondary"
            @click="click">Filter
          </v-btn>
        </v-flex> -->

        <!-- End filters -->
      </template>

      <!-- Start Graphs -->
      <v-flex
        xs12
        md12
      >
        <div class="card vld-parent">
          <loading
            :active.sync="isLoading"
            :can-cancel="false"
            :is-full-page="fullPage"
            loader="bars"
            color="#007bff"/>
          <highcharts
            ref="barChart"
            :options="barOptionsTest"/>
        </div>
      </v-flex>
      <!-- End Graphs -->
      <v-flex
        xs12
        md12
      >
        <highcharts
          ref="barChart"
          :options="barOptionsTime"/>
      </v-flex>
      <!-- Start Maps -->
        <Map v-if="user.role_id === 1 || user.role_id === 2 && !isLoading" :exposures="s" :users="userz" />
      <!-- End Maps -->

    </v-layout>
  </v-container>
</template>

<script>
import { Chart } from 'highcharts-vue'
import axios from 'axios'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import Highcharts, { error } from 'highcharts'
import exportingInit from 'highcharts/modules/exporting'
import { mapGetters, mapActions } from 'vuex'
import Map from '@/views/Map.vue'


exportingInit(Highcharts)

export default {
  components: {
    Loading,
    highcharts: Chart,
    Map
  },
  data () {
    return {
      cadres: [],
      partner: [],
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
      barOptionsTime: {
        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          title: {
            text: 'Year - Month'
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'No of Exposures',
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
          text: 'Monthly Exposure'
        },
        series: [
          {
            type: 'column',

            colorByPoint: true,
            name: 'No of Reported Exposures',
            data: []
          }

        ]
      },
      barOptionsTest: {
        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          title: {
            text: 'Year - Month'
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'No of Registration',
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
          text: 'Registration by Month'
        },
        series: [
          {
            type: 'column',
            colorByPoint: true,
            name: 'Registration in Numbers',
            data: []
          }
        ]
      },
      s: [],
      userz: [],
      load: true,
      u: 0,
      b: 0,
      p: 0,
      scount: 0,
      partners: 0,
      musers: 0,
      broad: [],
      total_users: [],
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
    broadcastsCount () {
      return this.b
    },

    aUsersCount () {
      return this.musers
    },

    partnerCount () {
      return this.p
    },

    usersCount () {
      return this.u
    },
    exposuresCount () {
      return this.scount
    },

    ...mapGetters({
      user: 'auth/user',
      auth: 'auth/token',
      e: 'auth/expo',
      all_users: 'auth/us_all',
      us_no: 'auth/us_no',
      next_link: 'auth/next_link',
      curr: 'auth/curr_page',
      last: 'auth/last_page'
    })
  },
  created () {
    if (this.auth === null) {
      alert('Not Logged in')
      this.$router.replace({
        name: 'login'
      })
    }
    if (this.user.role_id === 5) {
      this.subCounties()
      this.active = false
      if (this.curr === 0) {
        this.getAllUsers()
      } else if(this.curr !== this.last) {
        this.loopG(this.next_link)
      } else {
        this.userz = this.all_users
        this.u = this.all_users.length
        this.getTest(this.all_users)
        this.isLoading = false
      }
    }
    // this.getExp()
    if (this.e.length === 0) { this.getExp() } else { this.getMonth(this.e); this.scount = this.e.length; this.s = this.e }
    if (this.user.role_id !== 5) {
      if (this.us_no === 0) {
        this.getAllUsers()
      } else if (this.all_users.length !== this.us_no) {
        this.u = this.us_no
        this.loopG(this.next_link)
      } else {
        this.userz = this.all_users
        this.u = this.us_no
        this.getTest(this.all_users)
        this.isLoading = false
      }
    }
    this.getUsers()
    this.getPartners()
    // this.getAllUsers()
    this.getFacilities()
    this.getCounties()
    this.getBroadcasts()
    axios.get('cadres')
      .then((c) => {
        this.cadres = c.data.data
      })
  },
  methods: {
    click () {
      let exp = []; let us = []
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
          exp.push(this.s[e])
        }
      }
      for (var u in this.userz) {
        var i = new Date(this.userz[u].created_at).toISOString().substr(0, 10)
        if (dates.inRange(i, this.startDate, this.endDate)) {
          us.push(this.userz[u])
        }
      }
      this.getTest(us)
      this.getMonth(exp)
    },
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
      this.us_filt = []
      this.fac_filt = []
      this.exp_filt = []
      if (a.length > 0) {
        for (var c in a) {
          for (var f in this.all_facilities) {
            if (this.all_facilities[f].county === a[c].name) {
              this.fac_filt.push(this.all_facilities[f])
            }
          }
          for (var ex in this.s) {
            if (this.s[ex].county === a[c].name) {
              this.exp_filt.push(this.s[ex])
              // console.log(this.s[ex])
            }
          }
          for (var u in this.userz) {
            if (this.userz[u].county === a[c].name) {
              this.us_filt.push(this.userz[u])
            }
          }
        }
        this.getTest(this.us_filt)
        this.getMonth(this.exp_filt)
        this.fac = this.fac_filt.sort()
      } else {
        this.fac = this.all_facilities
        this.getTest(this.userz)
        this.getMonth(this.s)
      }
    },
    facilitySubCounty (a) {
      this.exp_filtl = []
      this.fac_filtl = []
      this.us_filtl = []
      this.fac_filt = this.all_facilities
      this.active_level = false
      if (a.length > 0) {
        for (var c in a) {
          for (var f in this.fac_filt) {
            if (this.fac_filt[f].sub_county === a[c].name) {
              this.fac_filtl.push(this.fac_filt[f])
            }
          }
          console.log(this.fac_filtl)
          for (var ex in this.exp_filt) {
            if (this.exp_filt[ex].sub_county === a[c].name) {
              this.exp_filtl.push(this.exp_filt[ex])
            }
          }
          for (var u in this.us_filt) {
            if (this.us_filt[u].sub_county === a[c].name) {
              this.us_filtl.push(this.us_filt[u])
            }
          }
        }
        this.getTest(this.us_filtl)
        this.getMonth(this.exp_filtl)
        this.fac = this.fac_filtl.sort()
      } else {
        this.fac = this.fac_filt
        this.getTest(this.us_filt)
        this.getMonth(this.exp_filt)
        this.active_level = true
      }
    },

    facilityLevel (a) {
      this.fac_filtf = []
      this.exp_filtf = []
      this.us_filtf = []
      this.active_fac = false
      //console.log(a)
      if (a.length > 0) {
        for (var c in a) {
          for (var f in this.fac_filtl) {
            if (this.fac_filtl[f].level === a[c]) {
              this.fac_filtf.push(this.fac_filtl[f])
            } else if (a[c] === 'Level 5 and Above') {
              if (Number(this.fac_filtl[f].level.slice(6, 7)) >= 5) {
                this.fac_filtf.push(this.fac_filtl[f])
              }
            }
          }
          for (var ex in this.exp_filtl) {
            if (this.exp_filtl[ex].facility_level === a[c]) {
              this.exp_filtf.push(this.exp_filtl[ex])
            } else if (a[c] === 'Level 5 and Above') {
              if (Number(this.exp_filtl[ex].facility_level.slice(6, 7)) >= 5) {
                this.exp_filtf.push(this.exp_filtl[ex])
              }
            }
          }
          for (var u in this.us_filtl) {
            if (this.us_filtl[u].facility_level === a[c]) {
              this.us_filtf.push(this.us_filtl[u])
            } else if (a[c] === 'Level 5 and Above') {
              if (Number(this.us_filtl[u].facility_level.slice(6, 7)) >= 5) {
                this.us_filtf.push(this.us_filtl[u])
              }
            }
          }
        }
        console.log(this.fac_filtf)
        this.getTest(this.us_filtf)
        this.getMonth(this.exp_filtf)
        this.fac = this.fac_filtf.sort()
      } else {
        this.fac = this.fac_filtl
        this.getTest(this.us_filtl)
        this.active_fac = true
        this.getMonth(this.exp_filtl)
      }
    },

    facilityFilter (a) {
      let b = []; let e = []; let us = []
      console.log(a)
      if (a.length > 0) {
        for (var c in a) {
          for (var ex in this.exp_filtf) {
            if (this.exp_filtf[ex].facility_id === a[c].id) {
              e.push(this.exp_filtf[ex])
            }
          }
          for (var u in this.us_filtf) {
            if (this.us_filtf[u].facility_name === a[c].name) {
              us.push(this.us_filtf[u])
            }
          }
        }
        this.getTest(us)
        this.getMonth(e)
      } else {
        this.getTest(this.us_filtf)
        this.getMonth(this.exp_filtf)
      }
    },

    cadreFilter (a) {
      this.us_filt = []
      this.fac_filt = []
      this.exp_filt = []
      if (a.length > 0) {
        for (var c in a) {
          for (var ex in this.s) {
            console.log(this.s[ex])
            if (this.s[ex].cadre === a[c].name) {
              this.exp_filt.push(this.s[ex])
              // console.log(this.s[ex])
            }
          }
          for (var u in this.userz) {
            if (this.userz[u].cadre_id === a[c].id) {
              this.us_filt.push(this.userz[u])
            }
          }
        }
        this.getTest(this.us_filt)
        this.getMonth(this.exp_filt)
        this.fac = this.fac_filt.sort()
      } else {
        this.fac = this.all_facilities
        this.getTest(this.userz)
        this.getMonth(this.s)
      }
    },

    getExp () {
      if (this.user.role_id === 1 || this.user.role_id === 2 || this.user.role_id === 5) {
        axios.get(`exposures/all`)
          .then((response) => {

            this.s = response.data.data
            this.link = response.data.links.next
            this.loopT(this.link)

            console.log(response.data)

            if (this.user.role_id === 5) {
              this.scount = 'loading...'
            } else {
              this.scount = response.data.meta.total
            }
            this.s = response.data.data
            this.link = response.data.links.next
            if (this.link) {
              this.loopT(this.link)
            } else {
              this.getMonth(this.s)
              this.storeExp(this.s)
            }
          })
          .catch(error => {
            console.log(error.message)
          })
      } else if (this.user.role_id === 4) {
        axios.get(`exposures/facility/${this.user.hcw.facility_id}`)
          .then((exp) => {
            this.scount = exp.data.meta.total
            this.s = exp.data.data
            this.link = exp.data.links.next
            if (this.link) {
              this.loopT(this.link)
            }
            else {
              this.getMonth(this.s)
              this.storeExp(this.s)
            }
          })
          .catch(error => console.log(error.message))
      }
    },
    async loopT (l) {
      var i
      var e = []
      if (this.user.role_id !== 5) {
        for (i = 0; i < 1;) {
          if (l != null) {
            let response = await axios.get(l)
            l = response.data.links.next
            this.s = this.s.concat(response.data.data)
            this.storeExp(this.s)
            this.getMonth(this.s)
          } else {
            i = 11
          }
        }
      } else if (this.user.role_id === 5) {
        for (i = 0; i < 1;) {
          if (l != null) {
            let response = await axios.get(l)
            l = response.data.links.next
            this.s = this.s.concat(response.data.data)
            this.storeExp(this.s)
          } else {
            i = 11
          }
        }
        for (var ex in this.s) {
          if (this.s[ex].county === this.user.hcw.county) {
            e.push(this.s[ex])
          }
          this.getMonth(e)
          this.storeExp(e)
        }
        this.scount = e.length
        this.s = e
        this.storeExp(this.s)
      }
      this.getMonth(this.s)
    },

    getMonth (list) {
      var wdata = []
      this.barOptionsTime.xAxis.categories = this.dateRange(this.startDate, this.endDate)
      for (var i in this.barOptionsTime.xAxis.categories) {
        wdata.push(this.getNumt(this.barOptionsTime.xAxis.categories[i], list))
      }
      this.barOptionsTime.series[0].data = wdata
    },

    getNumt (name, sa) {
      var counter = 0
      var c = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      for (var xt in sa) {
        var m = c.indexOf(sa[xt].exposure_date.slice(0, 3)) + 1
        if (m < 10) { m = '0' + m }
        var d = [sa[xt].exposure_date.slice(8, 13).trim(), m].join('-')
        if (d === name) {
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
    },

    ...mapActions({
      storeExp: 'auth/storeExp',
      storeAllUsers: 'auth/storeUser',
      storeUsNo: 'auth/storeUsNo',
      storePages: 'auth/storePages'
    }),

    getAllUsers () {
      if (this.user.role_id === 1 || this.user.role_id === 2 || this.user.role_id === 5) {
        axios.get('hcw')
          .then((exp) => {
            if (this.user.role_id === 5) {
              this.u = 'loading...'
              this.storePages(exp.data)
            } else {
              this.u = exp.data.meta.total
              this.storeUsNo(exp.data)
            }
            this.userz = exp.data.data
            this.storeAllUsers(this.userz)
            this.link = exp.data.links.next
            this.loopG(this.link)
          })
          .catch(error => console.log(error.message))
      } else if (this.user.role_id === 4) {
        axios.get(`hcw/facility/${this.user.hcw.facility_id}`)
          .then((exp) => {
            this.u = exp.data.meta.total
            this.userz = exp.data.data
            this.link = exp.data.links.next
            this.storeAllUsers(this.userz)
            this.loopG(this.link)
          })
          .catch(error => console.log(error.message))
      }
    },

    async loopG (l) {
      var i; var u = []
      this.userz = this.all_users
      if (this.user.role_id !== 5) {
        for (i = 0; i < 1;) {
          if (l != null) {
            let response = await axios.get(l)
            l = response.data.links.next
            this.userz = this.userz.concat(response.data.data)
            this.storeAllUsers(this.userz)
            this.storeUsNo(response.data)
            this.getTest(this.userz)
          } else {
            i = 11
          }
        }
      } else if (this.user.role_id === 5) {
        this.isLoading = true
        for (i = 0; i < 1;) {
          if (l != null) {
            let response = await axios.get(l)
            l = response.data.links.next
            this.userz = this.userz.concat(response.data.data)
            this.storePages(response.data)
            this.storeAllUsers(this.userz)
          } else {
            i = 11
          }
        }
        for (var ex in this.userz) {
          if (this.userz[ex].county === this.user.hcw.county) {
            u.push(this.userz[ex])
            this.getTest(u)
            this.storeAllUsers(u)
          }
        }
        this.userz = u
        this.u = u.length
        this.storeAllUsers(this.userz)
      }
      this.getTest(this.userz)
      this.isLoading = false
    },

    getTest (list) {
      this.load = true
      var reg = []
      this.barOptionsTest.xAxis.categories = this.dateRange(this.startDate, this.endDate)
      for (var r in this.barOptionsTest.xAxis.categories) {
        reg.push(this.getNumTest(this.barOptionsTest.xAxis.categories[r], list))
      }
      this.barOptionsTest.series[0].data = reg
    },

    getNumr (name, li) {
      var counter = 0
      for (var r in li) {
        var dat = new Date(li[r].created_at) 
        var list = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        if (list[dat.getMonth()] === name) {
          counter++
        }
      }
      return counter
    },
    getNumTest (name, li) {
      var counter = 0
      var c = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
      for (var xt in li) {
        var m = c.indexOf(li[xt].created_at.slice(5, 7)) + 1 
        if (m < 10) { m = '0' + m }
        var d = [li[xt].created_at.slice(0, 4).trim(), m].join('-')
        if (d === name) {
          counter++
        }
      }
      return counter
    },

    getPartners () {
      axios.get('partners') 
        .then((all_partners) => {
          this.partners = all_partners.data.data

          this.p = all_partners.data.meta.total

        })
        .catch(error => console.log(error.message))
    },

    getUsers () {
        axios.get('users') 
          .then((users) => {
            if (this.user.role_id === 1 || this.user.role_id === 2) {
              this.total_users = users.data.data
              
              this.loopBroad(users.data.links.next)

              this.musers = users.data.meta.total
            }
          })
          .catch(error => console.log(error.message))
    },

    async loopT (l) {
      var i
      for (i = 0; i < 1;) {
        if (l != null) {
          let response = await axios.get(l)
          l = response.data.links.next
          this.musers = this.musers.concat(response.data.data)
        } else {
          i = 11
        }
      } 
    },

    getBroadcasts () {
      if (this.user.role_id === 1 || this.user.role_id === 2) {
        axios.get('broadcasts/web/all')
          .then((broadcasts) => {
              this.broad = broadcasts.data.data

              this.b = broadcasts.data.meta.total
            
          })
          .catch(error => console.log(error.message))
      } else if (this.user.role_id === 4) {
        axios.get(`broadcasts/web/history/${this.user.hcw.facility_id}`)
          .then((broadcasts) => {
            this.b = broadcasts.data.meta.total
          })
          .catch(error => console.log(error.message))
      }
    },
    async loopBroad (l) {
      var i
      for (i = 0; i < 1;) {
        if (l != null) {
          let response = await axios.get(l)
          l = response.data.links.next
          this.broad = this.broad.concat(response.data.data)
        } else {
          i = 11
        }
      }
      for (var ex in this.broad) {
        if (this.broad[ex].facility) {
          if (this.broad[ex].facility.county === this.user.hcw.county) {
            this.b += 1
          }
        }
      }
    }
  }

}



</script>

<style scoped>
@import "../../node_modules/leaflet/dist/leaflet.css";
body {
  background-color: #e7d090;
  margin-left: 100px;
  margin-right: 100px;
}
#map {
  background-color: #eee;
}
</style>
