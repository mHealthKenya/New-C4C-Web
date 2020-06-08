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
        <material-card
          color="green"
          title="Create A Public Resource "
          text="Kindly fill all the required fields carefully"
        >
          <v-card-text>
            <div/>
            <p class="display-1 text--primary">
              Edit Public Resource
            </p>
          </v-card-text>

          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            @submit="editCME">
            <v-container py-0>
              <v-layout wrap>

                <v-flex
                  xs12
                  md12
                >
                  <v-text-field
                    id="title"
                    :rules="titleRules"
                    v-model="cme.title"
                    required
                    label="Title"
                    class="purple-input"/>
                </v-flex>

                <v-flex xs12>
                  <ckeditor
                    id="editorData"
                    :editor="editor"
                    v-model="cme.body"
                    :rules="bodyRules"
                    :config="editorConfig"
                    placeholder="Write here"
                    required/>
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

                  <v-img
                    :src="cme.file"
                    class="white--text align-end"
                    height="400px"
                  />

                </v-flex>

                <v-flex xs12>
                  <img
                    v-show="showPreview"
                    :src="imagePreview">
                </v-flex>

                <v-flex xs12>
                  <label for="document">Upload Documents:</label>
                  <input
                    id="files"
                    ref="files"
                    value="files"
                    type="file"
                    multiple
                    @change="handleFiles()">
                  {{ cme.files.file_name }}

                  <v-list
                    v-for="file in cme.files"
                    :key="file"
                    class="file-listing"> {{ file.file_name }}
                    <span
                      class="remove-file"
                      @click="removeFile(key)"> Remove </span>
                  </v-list>

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
                    class="mx-0 font-weight-light"
                    color="success"
                    type="submit"
                    @click="validateData(); alert=!alert; dialog1=true "
                  >
                    Save
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
                    outline color="error"
                    elevation="2"
                  >
                    <h6> {{ output.error }} {{ output.message }}  </h6>
                  </v-alert>

                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </material-card>
      </v-flex>

    </v-layout>

  </v-container>
</template>

<script>

import axios from 'axios'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default {
  data () {
    return {
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
      valid: true,
      titleRules: [
        v => !!v || 'Title is required'
      ],
      bodyRules: [
        v => !!v || 'Fill in the required text'
      ],
      dialog1: false,
      result: '',
      output: '',
      alert: false,
      cme: {
        body: '',
        title: ''
      },
      file: '',
      showPreview: false,
      imagePreview: '',
      files: [],
      resp: ''
    }
  },
  watch: {
    dialog1 (val) {
      if (!val) return
      setTimeout(() => (this.dialog1 = false), 8000)
    }
  },

  created () {
    this.getCME()
  },

  methods: {

    validateData () {
      this.$refs.form.validate()
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

    handleFiles () {
      let uploadedFiles = this.$refs.files.files

      // add uploaded files to an array
      for (var i = 0; i < uploadedFiles.length; i++) {
        this.files.push(uploadedFiles[i])
      }
    },

    removeFile (key) {
      this.files.splice(key, 1)
    },

    getCME () {
      var id = this.$route.params.id
      axios.get('resources/cmes/' + id)
        .then((resource) => {
          this.cme = resource.data.data
          console.log(resource.data)
        }).catch((error) => {
          console.log(error.message)
        })
    },

    editCME (e) {
      e.preventDefault()

      let formData = new FormData()

      // iterating over any file sent over appending the files
      for (var i = 0; i < this.files.length; i++) {
        let file = this.files[i]

        formData.append('cme_files[' + i + ']', file)
      }
      formData.append('image_file', this.file)
      formData.append('title', this.cme.title)
      formData.append('body', this.cme.body)
      formData.append('cme_id', this.cme.id)

      axios.post('resources/cmes/update', formData, {
        headers: { 'Content-Type': `multipart/form-data` }
      })
        .then((response) => {
          this.output = response.data
          console.log(response)

          this.alert = true

          this.$router.push('/cmes')
        })
        .catch(error => {
          this.output = error
          console.log(error)
          this.alert = true

        })
    }

  }
}

</script>

<style>
.document-editor {
    border: 1px solid var(--ck-color-base-border);
    border-radius: var(--ck-border-radius);
    min-height: 400px;
    display: flex;
    flex-flow: column nowrap;
}
span.remove-file{
  color:red;
  cursor: pointer;
}

</style>
