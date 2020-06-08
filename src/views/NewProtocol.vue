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
        md11
      >
        <v-card>

          <v-card-text>
            <p class="display-1 text--primary">

              Add A New Facility Resource
            </p>
            <div class="text--primary">
              Kindly fill all the required fields
            </div>
          </v-card-text>

          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            @submit="postProtocal">
            <v-container py-0>
              <v-layout wrap>

                <v-flex
                  xs12
                  md12
                >
                  <v-text-field
                    id="title"
                    :rules="[v => !!v || 'Title is required']"
                    v-model="title"
                    required
                    label="Title"
                    class="purple-input"/>
                </v-flex>

                <v-flex
                  xs12
                  md8>
                  <label>Facility:</label>

                  <div v-if="user.role_id === 4">
                    <v-chip
                      class="ma-2"
                      x-large
                    >
                      {{ user.hcw.facility_name }}
                    </v-chip>
                  </div>

                  <div v-else-if="user.role_id === 1 || user.role_id === 2">
                    <v-combobox
                      v-model="facility"
                      :items="all_facilities"
                      :loading="load"
                      :disabled="load"
                      :rules="[v => !!v || 'Facility is required']"
                      item-text="name"
                      item-value="id"
                      clearable
                      persistent-hint
                      chips />
                  </div>

                </v-flex>
                <v-flex xs12>
                  <ckeditor
                    id="editorData"
                    :editor="editor"
                    v-model="editorData"
                    required
                  />
                  <ul>
                    <li
                      v-for="error in errors"
                      :key="error">{{ error }}</li>
                  </ul>

                </v-flex>

                <v-flex xs12 >

                  <label for="document">Upload Image:</label>
                  <input
                    id="file"
                    ref="file"
                    value="file"
                    accept="image/*"
                    type="file"
                    @change="handleImageChange()">

                  <img
                    v-show="showPreview"
                    :src="imagePreview">
                </v-flex>

                <v-flex>
                  <label for="document">Upload Documents:</label>
                  <input
                    id="files"
                    ref="files"
                    value="files"
                    type="file"
                    multiple
                    @change="handleFiles()">

                  <v-card
                    v-for="(file, key) in files"
                    :key="file.id"
                    class="file-listing">{{ file.name }}
                    <span
                      class="remove-file"
                      @click="removeFile(key)"> Remove </span> </v-card>
                </v-flex>

                <v-flex
                  xs12
                  text-xs-right
                >
                  <v-btn
                    :disabled="!valid"
                    :loading="dialog1"
                    class="mx-0 font-weight-light"
                    color="success"
                    type="submit"
                    @click="validate(); dialog1=true"
                  >
                    Submit
                  </v-btn>

                  <v-dialog
                    v-model="dialog1"
                    max-width="290"
                    lazy>
                    <v-card>
                      <v-card-text class="text-xs-center">
                        <v-progress-circular
                          :size="70"
                          indeterminate
                          class="primary--text"/>
                      </v-card-text>
                    </v-card>
                  </v-dialog>

                  <v-alert
                    :value="alert"
                    icon = "mdi-alert"
                    dismissible
                    outline
                    color="error"
                    elevation="2"
                  >
                    <h6> {{ output.error }} {{ output.message }} </h6>
                  </v-alert>

                </v-flex>
              </v-layout>
            </v-container>
          </v-form>

        </v-card>
      </v-flex>

    </v-layout>

  </v-container>

</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default {

  data () {
    return {
      editor: ClassicEditor,
      editorData: '',
      editorConfig: { },
      items: [],
      errors: '',
      alert: false,
      valid: true,
      dialog1: false,
      result: '',
      facility_id: '',
      title: '',
      file: '',
      all_facilities: [],
      facility: '',
      showPreview: false,
      imagePreview: '',
      files: [],
      output: '',
      load: true

    }
  },

  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },
  watch: {
    dialog1 (val) {
      if (!val) return
      setTimeout(() => (this.dialog1 = false), 8000)
    }
  },
  created () {
    this.getFacilities()
  },

  methods: {
    validate () {
      this.$refs.form.validate()
    },

    getFacilities () {
      axios.get('facilities')
        .then((facilities) => {
          console.log(facilities.data)
          this.all_facilities = facilities.data.data
          this.load = false
        })
        .catch(error => console.log(error.message))
    },

    handleFiles () {
      let uploadedFiles = this.$refs.files.files

      for (var i = 0; i < uploadedFiles.length; i++) {
        this.files.push(uploadedFiles[i])
      }
    },

    handleImageChange (e) {
      this.file = this.$refs.file.files[0]

      let reader = new FileReader()

      reader.addEventListener('load', function () {
        this.showPreview = true
        this.imagePreview = reader.result
      }.bind(this), false)

      if (this.file) {
        if (/\.(jpe?g|png|gif)$/i.test(this.file.name)) {
          reader.readAsDataURL(this.file)
        }
      }
    },

    removeFile (key) {
      this.files.splice(key, 1)
    },

    postProtocal (e) {
      e.preventDefault()

      this.errors = []

      if (this.editorData == '') {
        this.errors.push('Description is required.')
      } else {
        let formData = new FormData()

        for (var i = 0; i < this.files.length; i++) {
          let file = this.files[i]

          formData.append('protocol_files[' + i + ']', file)
        }
        formData.append('image_file', this.file)
        formData.append('title', this.title)
        formData.append('body', this.editorData)
        if (this.user.role_id === 4) {
          formData.append('facility_id', this.user.hcw.facility_id)
        } else if (this.user.role_id === 1) {
          formData.append('facility_id', this.facility.id)
        } else if (this.user.role_id === 2) {
          formData.append('facility_id', this.facility.id)
        }

        axios.post('resources/protocols/create', formData, {
          headers: {
            'content-type': `multipart/form-data` }
        })
          .then((response) => {
            console.log(response)

            this.output = response.data
            this.alert = true
            this.$router.push('/protocols')
          })
          .catch(error => {
            this.output = error
            console.log(error)
            this.alert = true
          })
      }
    }
  }
}

</script>
<style>
span.remove-file{
  color:red;
  cursor: pointer;
}
ul {
  list-style: none;
  color: red;
}

</style>
