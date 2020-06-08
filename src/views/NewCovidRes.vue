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
              Add A New COVID 19 Resource
            </p>
            <div class="text--primary">
              Kindly fill all the required fields
            </div>
          </v-card-text>

          <v-form
            method="POST"
            ref="form"
            v-model="valid"
            lazy-validation
            @submit.prevent="postCOVID">
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

                <v-flex xs12>
                  <ckeditor
                    id="editorData"
                    :editor="editor"
                    v-model="editorData"
                    :config="editorConfig"
                    placeholder="Write here"
                    required/>

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

                <v-flex xs12>
                  <label for="document">Upload Documents:</label>
                  <input
                    id="files"
                    ref="files"
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
                    @click="validateData(); dialog1=true"
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
      editorData: '',
      editorConfig: {
        // The configuration of the editor.
      },
      valid: true,
      dialog1: false,
      result: '',
      errors: [],
      output: '',
      alert: false,
      title: '',
      file: '',
      showPreview: false,
      imagePreview: '',
      files: []
    }
  },
  watch: {
    dialog1 (val) {
      if (!val) return
      setTimeout(() => (this.dialog1 = false), 8000)
    }
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

    postCOVID (e) {
      e.preventDefault()

      this.errors = []

      if (this.editorData == '') {
        this.errors.push('Description is required.')
      } else {
        let formData = new FormData()

        // iterating over any file sent over appending the files
        for (var i = 0; i < this.files.length; i++) {
          let file = this.files[i]

          formData.append('resource_files[' + i + ']', file)
        }
        formData.append('image_file', this.file)
        formData.append('title', this.title)
        formData.append('body', this.editorData)

        axios.post('resources/special/create', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
          .then((response) => {
            this.output = response.data
            console.log(response)
            this.alert = true
            this.$router.push('/covid19_resources')
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
ul {
  list-style: none;
  color: red;
}

</style>
