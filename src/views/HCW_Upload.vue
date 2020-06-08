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
          title="Add a New Healthcare Worker"
          text="Kindly fill all the required fields"
        >
          <v-card-text>
            <div/>
            <p class="display-1 text--primary">
              Add A New Healthcare Worker
            </p>
            <div class="text--primary">
              Kindly fill all the required fields
            </div>
          </v-card-text>
          <v-form @submit="postUser">
            <v-container py-0>
              <v-layout wrap>
                <v-flex
                  xs11
                  
                >
                  <v-text-field
                    v-model="fname"
                    :rules="[rules.required]"
                    label="First Name"
                    class="green-input">
                  </v-text-field>  
                </v-flex>

                <v-flex
                  xs11
                  
                >
                  <v-text-field
                    v-model="surname"
                    :rules="[rules.required]"
                    label="Last Name"
                    class="green-input">
                  </v-text-field>  
                </v-flex>

                <v-flex
                  xs11
                  
                >
                  <v-text-field
                    v-model="email"
                    label="Email Address"
                    class="purple-input">
                  </v-text-field>  
                </v-flex>

                <v-flex
                  xs11
                
                >
                   <v-combobox
                    v-model="gendInp"
                    :items="gender"
                    :rules="[rules.required]"
                    label="Gender"
                    class="purple-input">
                   </v-combobox>  
                </v-flex> 
                

                <v-flex
                  xs11
                  
                >
                  <v-text-field
                    v-model="msisdn"
                    :rules="[rules.required]"
                    label="Mobile"
                    :hint="`${mobileHint}`"
                    single-line
                    class="purple-input">
                  </v-text-field>  
                </v-flex>

                <v-flex
                  xs12
                  md6
                  text-xs-left
                >
                  <v-btn
                    type="submit"
                    class="mx-0 font-weight-light"
                    color="infos"
                  >
                    Submit
                  </v-btn>
                </v-flex>

                <v-flex
                  xs12
                  md6
                  text-xs-right
                  >
                  <router-link to="/bulk-signup">
                    <v-btn
                      class="mx-0 font-weight-light"
                      color="primary"
                    >
                      File signup
                    </v-btn>
                  </router-link>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </material-card>
      </v-flex>

    </v-layout>
    <v-snackbar
      :timeout="timeout"
      :color="color"
      :bottom="bottom"
      :top="top"
      :left="left"
      :right="right"
      v-model="snackbar"
      dark
    >
      <v-icon
        color="white"
        class="mr-3"
      >
        mdi-bell-plus
      </v-icon>
      <div>{{ pre_out }} || {{ output.message }} || {{ output.errors }}</div>
      <v-icon
        size="16"
        @click="snackbar = false"
      >
        mdi-close-circle
      </v-icon>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  //
  data () {
    return {
      menu: false,
      timeout: 3000,
      fname: '',
      surname: '',
      gendInp: '',
      msisdn: '',
      email: '',
      output: '',
      pre_out: '',
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
        emailRules: v => /.+@.+/.test(v) || 'E-mail must be valid'
      },
      gender: [
        'MALE',
        'FEMALE',
        'TRANSGENDER',
        'UNDEFINED'
      ],
      mobileHint: ["Mobile Format is 254700000000"],
      resp: false,
      color: null,
      colors: [
        'success',
        'error'
      ],
      top: true,
      bottom: false,
      left: false,
      right: false,
      snackbar: false,
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },
 
  methods: {
   
    testFill () {
      if (this.fname === '') {
        this.pre_out = 'First Name must be filled out'
        this.snack('top', 'center')
        return false
      } else if (this.surname === '') {
        this.pre_out = 'surname must be filled out'
        this.snack('top', 'center')
        return false
      } else if (this.msisdn === '') {
        this.pre_out = 'Mobile must be filled out'
        this.snack('top', 'center')
        return false
      }  
      else if (this.gender === '') {
        this.pre_out = 'gender must be filled out'
        this.snack('top', 'center')
        return false
      }  
      else {
        return true
      }
    },
    clearData () {

    },
    postUser (e) {
      e.preventDefault()
      if (this.testFill()) {
        axios.post('auth/signup', {

          first_name: this.fname,
          surname: this.surname,
          email: this.email,
          msisdn: this.msisdn,
          gender: this.gendInp,
          role_id: "3",
          password: this.msisdn,
          password_confirmation: this.msisdn,

          message: "`Welcome to Care For the Carer (C4C) SMS Platform. You have been successfully registered. Messages sent and received are not charged.` ",

          consent: "1"
        })
          .then((response) => {
            this.output = response.data
            console.log(response)
            this.clearData()
            this.snack('top', 'center')

            this.$router.push('/hcw_list')
          })
          .catch((error) => {
            this.output = error
            this.snack('top', 'center')
          })
      }
    },
    snack (...args) {
      this.top = false
      this.bottom = false
      this.left = false
      this.right = false

      for (const loc of args) {
        this[loc] = true
      }
      if (this.resp) {
        this.color = this.colors[0]
      } else {
        this.color = this.colors[1]
      }

      this.snackbar = true
    }
  }
}
</script>
