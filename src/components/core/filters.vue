<template>
  <v-container
    grid-list-xl
  >
    <v-layout wrap>
      <v-flex
        md6
        lg2
      >

        <template>
          <v-flex
            xs12
          >
            <v-combobox
              v-model="selectedcounty"
              :items="all_counties"
              :search-input.sync="search"
              item-text="county"
              item-value="sub_county"
              multiple
              chips
              label="Select County"
              required
              @change="onSelect"
            />
          </v-flex>

        </template>

      </v-flex>

      <!-- second select -->

      <v-flex
        md6
        lg3
      >

        <template>
          <v-flex
            xs12
          >
            <v-combobox
              v-model="facility"
              :items="all_counties"
              :search-input.sync="search"
              item-text="selectedcounty"
              item-value="id"
              multiple
              chips
              label="Select Sub-County"
              required
            />
          </v-flex>
        </template>

      </v-flex>

      <!-- third select -->
      <v-flex
        md6
        lg2
      >

        <template>
          <v-flex
            xs12
          >
            <v-combobox
              v-model="facility"
              :items="all_facilities"
              :search-input.sync="search"
              item-text="partner"
              item-value="id"
              multiple
              chips
              label="Select Partner"
              required
            />
          </v-flex>
        </template>

      </v-flex>

      <v-flex
        md6
        lg2
      >

        <template>
          <v-flex
            xs12
          >
            <v-combobox
              v-model="facility"
              :items="all_facilities"
              :search-input.sync="search"
              item-text="name"
              item-value="id"
              multiple
              chips
              label="Select Facility Level"
              required
            />
          </v-flex>
        </template>

      </v-flex>

      <v-flex
        md6
        lg3
      >

        <template>
          <v-flex
            xs12
          >
            <v-combobox
              v-model="facility"
              :items="all_facilities"
              :search-input.sync="search"
              item-text="name"
              item-value="id"
              multiple
              chips
              label="Select Facility"
              required
            />
          </v-flex>

        </template>

      </v-flex>

      <!-- Fourth select -->

      <template>

        <v-flex
          md6
          lg10
        >
          <template>

            <input
              v-model="startDate"
              type="date"
              label="From">
            <input
              v-model="endDate"
              type="date">
          </template>
        </v-flex>

      </template>

    </v-layout>
  </v-container>

</template>

<script>
import axios from 'axios'
import format from 'date-fns/format'
import { mapGetters, mapState } from 'vuex'

export default {

  data () {
    return {
      facility: '',
      selectedcounty: '',
      county: '',
      all_counties: [],
      all_facilities: []
    }
  },

  computed: {
    getCounties () {
      return this.all_facilities.reduce((seed, current) => {
        return Object.assign(seed, {
          [current.county]: current
        })
      })
      console.log(current.county)
    }
  },

  created () {
    this.getFacilities()
  },

  methods: {
    getFacilities () {
      axios.get('facilities')
        .then((facilities) => {
          console.log(facilities.data)
          this.all_facilities = facilities.data.data
          this.all_counties = facilities.data.data
          if (facilities.data.links.next != null) {
            this.link = facilities.data, links.next
            this.loopT(this.link)
          }
        })
        .catch(error => console.log(error.message))
    },

    onSelect (e) {
      if (e.length == 0) {
        this.all_facilities.forEach((item) => item.disabled = false)
      } else {
        let chosen = this.all_facilities.filter((item) => item.id == e[0])
        this.all_facilities.forEach((item) => {
          if (item.sub_county != chosen[0].sub_county) {
            item.disabled = true
          }
        })
      }
    }

  }
}
</script>
