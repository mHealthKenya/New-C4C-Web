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
          <v-text-field
            v-model="search"
            append-icon="mdi-search-web"
            label="Search"
            single-line
            hide-details
          /><br>
          <v-data-table
            :headers="headers"
            :items="feedback"
            :search="search"
            :rows-per-page-items="rowsPerPageItems"
            show-actions
            item-key="id"
          >
            <template
              slot="items"
              slot-scope="props">
              <tr @click="props.expanded = !props.expanded">
                <td>{{ props.item.category }}</td>
                <td>{{ props.item.type }}</td>
                <td>{{ props.item.feedback }}</td>
                <td>{{ Boolean(props.item.anonymous) }}</td>
                <td>{{ props.item.created_at }}</td>
              </tr>
            </template>
            <template
              slot="expand"
              slot-scope="props">
              <v-card flat>
                <v-card-text v-if="props.item.file">Files: {{ props.item.file }}</v-card-text>
                <v-card-text v-else>No files included</v-card-text>
              </v-card>
            </template>
          </v-data-table>
        </material-card>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      rowsPerPageItems: [50, 250, 500],
      search: '',
      link: '',
      output: [],
      headers: [
        {
          text: 'Category',
          value: 'category'
        },
        {
          sortable: false,
          text: 'Type',
          value: 'type'
        },
        {
          text: 'Feedback',
          value: 'feedback',
          width: '500px'
        },
        {
          sortable: false,
          text: 'Anonymous',
          value: 'Anonymous'
        },
        {
          text: 'Date',
          value: 'date'
        }
      ],
      feedback: []
    }
  },
  created () {
    this.getFeed()
  },
  methods: {
    getFeed () {
      axios.get('feedback')
        .then((exp) => {
          this.feedback = exp.data.data
          this.link = exp.data.links.next
          console.log(this.link)
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
          this.feedback = this.feedback.concat(response.data.data)
        } else {
          i = 11
        }
      }

      console.log(this.feedback)
    }
  }
}
</script>
