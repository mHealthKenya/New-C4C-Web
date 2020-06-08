<template>
  <v-container
    fill-height
    fluid
    grid-list-xl>
    <v-layout
      justify-center
      wrap
    >
      <v-flex
        xs12
        md10
      >
        <material-card
          color="green"
          title="Create A Resource, Guideline or Protocal "
          text="Kindly fill all the required fields carefully"
        >
          <v-form @submit="postCME">
            <v-container py-0>
              <v-layout wrap>

                <v-flex
                  xs12
                  md12
                >
                  <v-text-field
                    id="title"
                    :rules="[rules.required]"
                    v-model="title"
                    label="Title"
                    class="purple-input"/>
                </v-flex>

                <v-flex xs12>
                  <ckeditor-ckeditor
                    id="editor"
                    v-model="editor"
                  />
                </v-flex>

                <v-flex xs12>
                  <input
                    id="file"
                    ref="file"
                    class="excel-upload-input"
                    name="file"
                    type="file"
                    @change="handleFile">
                </v-flex>
                <v-flex
                  xs12
                  text-xs-right
                >
                  <v-btn
                    class="mx-0 font-weight-light"
                    color="success"
                    type="submit"
                  >
                    Submit
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
          <strong>Output:</strong>
          <pre> {{ output }} </pre>
        </material-card>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'
import ckeditor from './../components/ckeditor/ckeditor'

export default {
  components: {
    ckeditor: ckeditor
  },
  data () {
    return {
      title: '',
      editor: '',
      file: '',
      output: '',
      rules: {
        required: value => !!value || 'Required.'
      }
    }
  },

  methods: {
    handleFile (e) {
      this.file = this.$refs.file.files[0]
    },

    postCME (e) {
      e.preventDefault()

      const allData = new FormData()
      // dict of all elements
      allData.append('file', file)
      allData.append('title', this.title)
      allData.append('editor', this.editor)

      let currentObj = this

      axios({
        method: 'POST',
        url: 'resources/cmes/create',
        data: allData

      })
        .then(function (response) {
          currentObj.output = response.data
        })
        .catch(function (error) {
          currentObj.output = error
        })
    }
  }

}
</script>
