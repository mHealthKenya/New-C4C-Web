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
          title="New Broadcast"
          text="Kindly fill all the required fields"
          >
          <v-card-text>
              <p class="display-1 text--primary">
                New Bulk Broadcast
              </p>

              <div class="text--primary">
                If you are uploading an exel, the column name of the phone numbers should be 'mobile'
              </div>
          </v-card-text>

          <div style="height:10%">
            <upload-excel-component
            :on-success="handleSuccess"
            :before-upload="beforeUpload" />
          </div>

          <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="post_BulkBroadcast">
            <v-container py-0>
              <v-layout wrap>
                <v-flex
                  xs12
                >
                  <v-text-field
                    :rules="[rules.required]"
                    v-model="phoneNo"
                    label="Add Phone Numbers Seperated By A Comma"
                    required
                    single-line
                  >
                  {{phoneNo}}
                  </v-text-field>
                </v-flex>

                <v-flex
                  xs12
                >
                  <v-textarea
                    :rules="textRules"
                    v-model="message"
                    label="Message"
                    counter
                    placeholder="Write here"
                    required
                  />
                </v-flex>

              <v-flex
              xs12
              >
                <v-btn
                  :disabled="!valid"
                  class="mr-4 success"
                  type="submit"
                  @click="validate(); alert=!alert; dialog1=true ">
                  submit</v-btn>
              </v-flex>

              <v-flex
                xs12
              >
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
import UploadExcelComponent from '@/components/UploadExcel/index.vue'

export default {
  components: { UploadExcelComponent },
  data () {
    return {
      phoneNo: [],
      tableHeader: [],
      valid: true,
      dialog1: false,
      alert: false,
      output: '',
      phoneNumbers: [],
      message: '',
      rules: {
        required: value => !!value || 'This field is required.'
      },
      textRules: [v => v.length <= 160 || 'Max of 160 Characters' || 'This field is required.'],
    }
  },

  watch: {
    dialog1 (val) {
      if (!val) return
      setTimeout(() => (this.dialog1 = false), 4000)
    }
  },

  methods: {
    validate () {
      this.$refs.form.validate()
    },

    post_BulkBroadcast (e) {
      e.preventDefault()
      console.log(String(this.phoneNo))
      axios.post('broadcasts/web/direct', {
        phone_numbers: String(this.phoneNo),
        message: this.message
      })
        .then((response) => {
          this.output = response.data
          this.resp = Boolean(response.data.success)
          this.alert = true
          this.$router.push('/all_broadcasts')
        })
        .catch(error => {
          this.output = error
          this.alert = true
        })
    },
    beforeUpload (file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess ({ results, header }) {
      this.tableHeader = header
      this.is_data = false
      for (var r in results) {
        if (String(results[r].mobile).slice(0,3) != '254' && String(results[r].mobile).slice(0,1) === '7') {
          results[r].mobile = '254'+ String(results[r].mobile)
        } else if (String(results[r].mobile).length < 5) {
          console.log(results.splice(r,1))
          break
        }
        this.phoneNo.push(results[r].mobile)
      }
    },
  }
}
</script>
