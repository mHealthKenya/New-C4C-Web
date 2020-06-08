<template>

  <v-card>
    <!-- Start filters -->
    <template>
      <v-container
        fill-height
        fluid
        grid-list-xl
      >
        <v-layout
        justify-center
        wrap>
          <v-flex
            xs12
            md6
            lg2
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
                v-on:change="getFacilitysubcountyfilter"
                :disabled="active"
                multiple
                clearable
                persistent-hint
                chips/>
            </template>
          </v-flex>

          <v-flex
            xs12
            md6
            lg2
          >

            <template>
              <v-combobox
                v-if="user.role_id !== 4"
                v-model="partner"
                :items="all_partner"
                item-text="partner"
                item-value="sub_county"
                label="Select Partner"
                multiple
                disabled
                clearable
                persistent-hint
                chips/>

            </template>
          </v-flex>

          <v-flex
            xs12
            md6
            lg2
          >
            <template>
              <v-combobox
                v-if="user.role_id !== 4"
                :items="all_facilities_level"
                label="Select Facility Level"
                v-on:change="getFacilitylevelfilter"
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
            lg2
          >
            <template>
              <v-combobox
                v-if="user.role_id !== 4"
                v-model="facility"
                :items="fac"
                item-text="name"
                item-value="id"
                label="Select Facility"
                v-on:change="getFacilityfilter"
                :disabled="active_fac"
                multiple
                clerable
                persistent-hint
                chips/>
            </template>
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
              v-on:change="cadreFilter"
              multiple
              clearable
              persistent-hint
              chips/>
          </v-flex>
          <v-flex xs12 md2>
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
          <v-flex xs12 md2>
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
        </v-layout>
      </v-container>
    </template>
      
            <!-- End filters -->
    <v-tabs
      color="teal lighten-5"
      centered
    >
      <v-tab>Summary</v-tab>
      <v-tab>Report By Cadre</v-tab>
      <v-tab>Report By Age</v-tab>
      <v-tab>Report By Gender</v-tab>
      <v-tab-item
        v-for="n in 4"
        :key="n">
        <v-container fluid>
          <v-card-text v-if="n==1">
            <!-- Start Graphs -->
          

            <v-flex
              xs12
              md12
              lg12
              >
              <div class="card vld-parent">
                <loading :active.sync="isLoading" 
                :can-cancel="false"
                color="#007bff"
                :is-full-page="fullPage"></loading>
            
                <highcharts
                  ref="barChart"
                  :options="monthOptions"/>
              </div>
            </v-flex>
          </v-card-text>

          <v-card-text v-if="n==2">
            <v-flex
              md12
              sm12
              lg12
            >
            <template>
              <div class="card vld-parent">
                <loading :active.sync="isLoading" 
                :can-cancel="false"
                loader='bars'
                :is-full-page="fullPage"></loading>
                <highcharts
                  ref="barChart"
                  :options="cadrOptions"/>
              </div>
            </template>
            </v-flex>
          </v-card-text>

          <v-card-text v-if="n==3">
            <v-flex
              md12
              sm12
              lg12
            >
            <div class="card vld-parent">
              <loading :active.sync="isLoading" 
              :can-cancel="false"
              loader='bars'
              :is-full-page="fullPage"></loading>
              <highcharts
                ref="barChart"
                :options="barOptions"/>
            </div>
            </v-flex>
          </v-card-text>

          <v-card-text v-if="n==4">
            <v-flex
              md12
              sm12
              lg12
            >
            <div class="card vld-parent">
              <loading
                :active.sync="isLoading"
                :can-cancel="false"
                loader='bars'
                :is-full-page="fullPage"></loading>
                  <highcharts
                    ref="barChart"
                    :options="gendOptions"/>
            </div>
            </v-flex>
            
          </v-card-text>

        </v-container>
      </v-tab-item>
    </v-tabs>
  </v-card>

</template>

<script>
import { Chart } from 'highcharts-vue'
import axios from 'axios'
import VueHighcharts from 'vue2-highcharts'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import exportingInit from 'highcharts/modules/exporting'
import Highcharts from 'highcharts'
import { mapGetters } from 'vuex'

// SeriesLabel(Highcharts);
exportingInit(Highcharts)

export default {
  components: {
    highcharts: Chart,
    VueHighcharts,
    Loading
  },
  data () {
    return {
      cadres: [],
      isLoading: true,
      fullPage: false,
      all_partner: [],
      partner: [],
      fac: [],
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
      menu: false,
      menu1: false,
      startDate: '2017-01-01',
      maxDate: new Date().toISOString().substr(0, 10),
      minDate: '2017-01-01',
      endDate: new Date().toISOString().substr(0, 10),
      monthOptions: {
        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          title: {
            text: 'Year - Month'
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'No. of HCWS registered',
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
          text: 'HCWS registered on C4C by Month '
        },
        series: [
          {
            type: 'column',
            colorByPoint: true,
            data: []
          }
        ]
      },

      barOptions: {
        xAxis: {
          categories: ['18 - 25', '26 - 35', '36 - 45', '46 - 55', '56 - 65', '65 and Above', 'undefined'],
          title: {
            text: 'Age Groups'
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'No. of Registered HCWS',
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
          text: 'Registration by Age'
        },
        series: [
          {
            name: 'Numbers',
            colorByPoint: true,
            data: []
          }
        ]
      },
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
            text: 'No. of Registered HCWS',
            align: 'high'
          },
          labels: {
            overflow: 'justify'
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
          text: 'Registration by Gender'
        },
        series: [
          {
            name: 'Numbers',
            colorByPoint: true,
            data: []
          }
        ]
      },
      cadrOptions: {
        xAxis: {
          categories: ['Cleaner', 'Clinical officer', 'Doctor', 'Laboratory Technologist', 'Nurse', 'Other-Specify', 'Student', 'VCT Counsellor', 'Waste Handler'],
          title: {
            text: 'Cadre'
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'No. of Registered HCWS',
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
          text: 'Registration by Cadre'
        },
        series: [
          {
            name: 'Numbers',
            colorByPoint: true,
            data: []
          }
        ]
      },
      s: [],
      userz: [],
      load: true,
      fac_filt: [],
      fac_filtl: [],
      fac_filtf: [],
      reg_filt: [],
      reg_filtl: [],
      reg_filtf: [],
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      all_users: 'auth/us_all',
      us_no: 'auth/us_no',
      next_link: 'auth/next_link'
    })
  },

  created () {
    if (this.us_no === 0) {
      this.getUsers()
    } else if (this.all_users.length !== this.us_no) {
      this.s = this.all_users
      this.loopT(this.next_link)
    } else {
      this.s = this.all_users
      this.getsummarydata(this.s)
      this.getAgeData(this.s)
      this.isLoading = false
    }
    this.getFacilities()
    this.getCounties()
    axios.get('cadres')
      .then((c)=>{
        this.cadres = c.data.data
      })
  },
  methods: {
    getCounties () {
      axios.get('counties')
        .then((counties) => {
          console.log(counties.data.data)
          this.all_counties = counties.data.data
        })
        .catch(error => console.log(error.message))
    },
    getSubCounties (sb) {
      if (sb.length > 0) {
        this.active = false
        this.all_subcounties = []
        for (var i in sb) {
          axios.get(`subcounties/${sb[i].id}`)
            .then((subcounties) => {
              // console.log(subcounties.data)
              this.all_subcounties = this.all_subcounties.concat(subcounties.data.data)
            })
            .catch(error => console.log(error.message))
        }
        this.getfacilityCountyfilter(sb)
      } else {
        this.active = true
        this.getfacilityCountyfilter(sb)
      }
    },

     getFacilities () {
      axios.get('facilities')
        .then((facilities) => {
          console.log(facilities.data)
          this.all_facilities = facilities.data.data
        })
        .catch(error => console.log(error.message))
    },

     getfacilityCountyfilter (fc) {
      this.fac_filt = [], this.reg_filt = []
      if (fc.length > 0) {
        for (var c in fc) {
          for (var f in this.all_facilities) {
            if (this.all_facilities[f].county === fc[c].name) {
              this.fac_filt.push(this.all_facilities[f])
            }
          }
            for(var u in this.s){
                if(this.s[u].county === fc[c].name){
                  this.reg_filt.push(this.s[u])
                }
           }
        }
        this.getsummarydata(this.reg_filt)
        this.getAgeData(this.reg_filt)
        this.fac = this.fac_filt.sort()
      } else {
        this.fac = this.all_facilities
        this.getsummarydata(this.s)
        this.getAgeData(this.s)
        
      }
    },
    getFacilitysubcountyfilter (fsb){
      this.fac_filtl = [], this.reg_filtl = []
      this.active_level = false
      if(fsb.length > 0){
        for(var t in fsb){
          for(var u in this.fac_filt){
            if(this.fac_filt[u].sub_county === fsb[t].name){
              this.fac_filtl.push(this.fac_filt[u])
            }
          }
            for(var k in this.reg_filt){
                if(this.reg_filt[k].sub_county === fsb[t].name){
                  this.reg_filtl.push(this.reg_filt[k])
                }
              }
          
        }
        this.getsummarydata(this.reg_filtl)
        this.getAgeData(this.reg_filtl)
        this.fac = this.fac_filtl.sort()
      } else {
        this.fac = this.fac_filt
        this.getsummarydata(this.reg_filt)
        this.getAgeData(this.reg_filt)
        this.active_level = true
        
      }
    },
    getFacilitylevelfilter (fl){
       this.fac_filtf = [], this.reg_filtf = []
       this.active_fac = false
       if(fl.length > 0){
         for(var l in fl){
           for(var f in this.fac_filtl){
             if(this.fac_filtl[f].level === fl[l]){
               this.fac_filtf.push(this.fac_filtl[f])
             }else if(fl[l] === 'Level 5 and Above'){
               if(Number(this.fac_filtl[f].level.slice(6,7)) >= 5){
                 this.fac_filtf.push(this.fac_filtl[f])
               }
             }
           }
           for(var k in this.reg_filtl){
             if(this.reg_filtl[k].facility_level == fl[l]){
               this.reg_filtf.push(this.reg_filtl[k])
             }else if (fl[l] === 'Level 5 and Above'){
               if(Number(this.reg_filtl[k].facility_level.slice(6,7)) >= 5){
                 this.reg_filtf.push(this.reg_filtl[k])
               }
             }
           }
         }
       this.getsummarydata(this.reg_filtf)
       this.getAgeData(this.reg_filtf)
        this.fac = this.fac_filtf.sort()
      } else {
        this.fac = this.fac_filtl
        this.getsummarydata(this.reg_filtl)
        this.getAgeData(this.reg_filtl)
        this.active_fac = true
        
      }
    },

    getFacilityfilter(ff){
      let al = [],  rg = []
      if(ff.length > 0){
        for(var v in ff){
          for(var k in this.reg_filtf){
            this.reg_filtf[k].facility_name == ff[v].name
            rg.push(this.reg_filtf[k])
          }
        }
        this.getsummarydata(rg)
        this.getAgeData(rg)
      }
       else{
          this.getsummarydata(this.reg_filtf)
          this.getAgeData(this.reg_filtf)
        }
    },

    cadreFilter (fc) {
      this.fac_filt = [], this.reg_filt = []
      if (fc.length > 0) {
        for (var c in fc) {
          for(var u in this.s){
            if(this.s[u].cadre_id === fc[c].id){
              this.reg_filt.push(this.s[u])
            }
          }
        }
        this.getsummarydata(this.reg_filt)
        this.getAgeData(this.reg_filt)
      } else {
        this.getsummarydata(this.s)
        this.getAgeData(this.s)
        
      }
    },

    click (){
      let reg = []
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
       for (var r in this.s) {
        var i = new Date(this.s[r].created_at).toISOString().substr(0, 10)
        if (dates.inRange(i,this.startDate,this.endDate)) {
          reg.push(this.s[r])
        }
      }
      this.getsummarydata(reg)
      this.getAgeData(reg)
    },

    getUsers () {
      if (this.user.role_id === 1 || this.user.role_id == 5 || this.user.role_id == 2) {
        axios.get('hcw')
          .then((exp) => {
            this.s = exp.data.data
            if (exp.data.links.next != null) {
              this.link = exp.data.links.next
              this.loopT(this.link)
            } else {
              console.log('mm')
              this.getAgeData()
              
            }
          })
          .catch(error => console.log(error.message))
      } else if (this.user.role_id === 4) {
        axios.get(`hcw/facility/${this.user.hcw.facility_id}`)
          .then((exp) => {
            this.s = exp.data.data
            // console.log(exp.data)
            if (exp.data.links.next != null) {
              this.link = exp.data.links.next
              this.loopT(this.link)
            } else {
              console.log(this.s)
              this.getAgeData()
             
            }
          })
          .catch(error => console.log(error.message))
      }
    },
    async loopT (l) {
      var i, u = []
      for (i = 0; i < 1;) {
        if (l != null) {
          let response = await axios.get(l)
          l = response.data.links.next
          this.s = this.s.concat(response.data.data)
          this.getsummarydata(this.s)
          this.getAgeData(this.s)
        } else {
          i = 11
        }
      }
      if (this.user.role_id == 5) {
        for (var t in this.s) {
          if (this.s[t].county == this.user.county){
            u.push(this.s[t])
          }
        }
        this.s = u
      }
      this.getsummarydata(this.s)
      this.getAgeData(this.s)
      this.isLoading = false
    },

    getAgeData (list) {
      this.load = true
      var data = []
      for (var i in this.barOptions.xAxis.categories) {
        data.push(this.getAgeNum(i,list))
      }
      this.barOptions.series[0].data = data
      this.load = false
      
      this.load = true
      data = []
      for (var i in this.gendOptions.xAxis.categories) {
        data.push(this.getGend(this.gendOptions.xAxis.categories[i],list))
      }
      this.gendOptions.series[0].data = data
      this.load = false
      
      this.load = true
      data = []
      for (var i in this.cadrOptions.xAxis.categories) {
        data.push(this.getCadre(this.cadrOptions.xAxis.categories[i],list))
      }
      this.cadrOptions.series[0].data = data
      this.load = false
      
    },

    getsummarydata (list){
      this.load = true
        var reg = []
         this.monthOptions.xAxis.categories = this.dateRange(this.startDate, this.endDate)
      for (var r in this.monthOptions.xAxis.categories) {
        reg.push(this.getNumr(this.monthOptions.xAxis.categories[r],list))
        
      }
      this.monthOptions.series[0].data = reg
      this.load = false
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

    getAgeNum (cat, a) {
      var count = 0
      for (var x in a) {
        var date = new Date(a[x].dob)
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
        } else if (cat == 6 && isNaN(age)) {
          count++
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
    getCadre (cat, c) {
      var count = 0
      for (var x in c) {
        if (c[x].cadre === cat) {
          count++
        }
      }
      return count
    },

    getNumr (name, reg) {
       var counter = 0
      var c = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
      for (var xt in reg) {
        var m = c.indexOf(reg[xt].created_at.slice(5, 7)) + 1 
        if (m < 10) { m = '0' + m }
        var d = [reg[xt].created_at.slice(0, 4).trim(), m].join('-')
        if (d === name) {
          counter++
        }
      }
      return counter
    }
  }

}
</script>
