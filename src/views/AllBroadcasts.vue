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
        <div> {{ output.errors }} {{ result }}</div>
        <v-icon
          size="16"
          @click="snackbar = false"
        >
          mdi-close-circle
        </v-icon>
      </v-snackbar>

      <v-flex
        xs12
        text-xs-right
      >

        <div v-if="user.role_id === 1 || user.role_id === 2">
          <v-btn
            class="mx-0 font-weight-light "
            color="success"
            @click="$router.push('new_bulk_broadcast')"
          >
            Send A Bulk Broadcast
          </v-btn>

          <v-btn
            class="mx-0 font-weight-light "
            color="success"
            @click="$router.push('new_broadcast')"
          >
            Send A New Broadcast
          </v-btn>
        </div>

        <div v-else>
          <v-btn
            class="mx-0 font-weight-light "
            color="success"
            @click="$router.push('new_broadcast')"
          >
            Send A New Broadcast
          </v-btn>
        </div>

      </v-flex>

      <v-flex
        md12
      >
        <v-card>
          <v-card-title>
            Broadcast History
            <v-spacer/>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            />

          </v-card-title>
          <v-data-table
            :headers="headers"
            :rows-per-page-items="rowsPerPageItems"
            :items="all_messages"
            :loading="true"
            :search="search"
            class="elevation-1"
            show-actions
            item-key="id"
          >

            <template slot="no-data">
              <v-progress-linear
                slot="progress"
                indeterminate/>
            </template>
             {{all_messages}}

            <template
              slot="items"
              slot-scope="props">
              <tr @click="props.expanded = !props.expanded">
                <td>{{ props.item.cadre.name }}</td>
                <td>{{ props.item.created_by }}</td>
                <td>{{ props.item.approved_by }}</td>
                <td>{{ props.item.facility.name }}</td> 
                <td>{{ props.item.created_at }}</td>
                <td>{{ props.item.message }}</td>
                
              </tr>
            </template>
            <v-alert
              slot="no-results"
              :value="true"
              color="success"
              icon="mdi-emoticon-sad">
              Your search for "{{ search }}" found no results.
            </v-alert>

          </v-data-table>
        </v-card>
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
      output: '',
      result: '',
      search: '',
      isLoading: true,
      snackbar: false,
      rowsPerPageItems: [100, 500, 1000],
      all_messages: [],
      headers: [
        {
          sortable: false,
          text: 'Cadre',
          value: 'cadre_id'
        },
        {
          sortable: false,
          text: 'Created By',
          value: 'created_by'
        },
        {
          sortable: false,
          text: 'Approved By',
          value: 'approved_by'
        },
        {
          sortable: false,
          text: 'Facility',
          value: 'facility'
        },
        {
          sortable: false,
          text: 'Time',
          value: 'created_at'
        },
        {
          sortable: false,
          text: 'Message',
          value: 'message'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },
  created () {
    this.getBroadcast()
  },

  methods: {
    getBroadcast () {
      if (this.user.role_id === 1 || this.user.role_id === 2 || this.user.role_id === 5) {
        axios.get(`broadcasts/web/all`)
          .then((broadcast) => {
            console.log(broadcast.data)
            this.all_messages = broadcast.data.data
            this.loopT(broadcast.data.links.next)
            this.isLoading = false
          })
          .catch(() => {
            this.result = 'Check your internet connection or retry logging in.'
            this.snackbar = true
          })
      } else if (this.user.role_id === 4) {
        axios.get(`broadcasts/web/history/${this.user.hcw.facility_id}`)
          .then((broadcast) => {
            console.log(broadcast.data)
            this.all_messages = broadcast.data.data
            this.loopT(broadcast.data.links.next)
            this.isLoading = false
          })
          .catch(() => {
            this.snackbar = true
            this.result = 'Check your internet connection or retry logging in.'
          })
      }
    },
    async loopT (l) {
      var i; var u = []
      for (i = 0; i < 1;) {
        if (l != null) {
          let response = await axios.get(l)
          l = response.data.links.next
          this.all_messages = this.all_messages.concat(response.data.data)
        } else {
          i = 11
        }
      }
      if (this.user.role_id === 5) {
        for (var ex in this.all_messages) {
          if (this.all_messages[ex].facility) {
            if (this.all_messages[ex].facility.county === this.user.hcw.county) {
              u.push(this.all_messages[ex])
            }
          }
        }
        this.all_messages = u
      }
    }
  }
}
</script>-


