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
        md8
      >
        <v-form @submit="postUser">
          <material-card
            color="green"
            title="Edit Profile"
            text="Complete your profile"
          >

            <v-card-text>
              <p class="display-1 text--primary">
                User Profile
              </p>
              <div class="text--primary"/>
            </v-card-text>
            <v-container py-0>
              <v-layout wrap>
                <v-flex
                  xs12
                  md4
                >
                  <v-text-field
                    v-model="userData.first_name"
                    :rules="[v => !!v || 'First Name is required']"
                    label="First Name"
                  />
                </v-flex>

                <v-flex
                  xs12
                  md4
                >
                  <v-text-field
                    v-model="userData.surname"
                    :rules="[v => !!v || 'Surname is required']"
                    label="Surname"
                  />
                </v-flex>

                <v-flex
                  xs12
                  md4
                >
                  <v-select
                    v-model="userData.gender"
                    :items="gender"
                    :rules="[v => !!v || 'Gender is required']"
                    label="Gender"
                    required
                    autocomplete
                  />
                </v-flex>

                <v-flex
                  xs12
                  md6
                >
                  <v-text-field
                    v-model="userData.email"
                    :rules="[v => !!v || 'Email is required']"
                    label="E-mail"
                    required
                  />
                </v-flex>

                <v-flex
                  xs12
                  md6
                >
                  <v-select
                    v-model="userData.role"
                    :items="roles"
                    :rules="[v => !!v || 'Role is required']"
                    :hint="`${user.role.name}`"
                    item-value="id"
                    item-text="name"
                    label="Role"
                    required
                    return-object
                    persistent-hint
                    autocomplete
                  />
                </v-flex>

                <v-flex
                  xs12
                  md6>
                  <v-select
                    :items="all_facilities"
                    v-model="userData.hcw.facility_name"
                    :hint="`${user.hcw.facility_name}`"
                    :rules="[v => !!v || 'Facility is required']"
                    item-value="id"
                    item-text="name"
                    label="Facility"
                    persistent-hint
                    required
                    autocomplete
                  />
                </v-flex>

                <v-flex
                  xs12
                  md6>
                  <v-select
                    v-model="userData.cadre"
                    :items="all_cadres"
                    :rules="[v => !!v || 'Cadre is required']"
                    :hint="`${user.cadre}`"
                    item-value="id"
                    item-text="name"
                    required
                    label="Cadre"
                    persistent-hint
                    autocomplete
                  />
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
                    Update Profile
                  </v-btn>

                  <v-alert
                    :value="alert"
                    icon = "mdi-alert"
                    dismissible
                    outline
                    color="error"
                    elevation="2"
                  >
                    <h6> {{ output.error }} {{ output.message }} {{ output }} </h6>
                  </v-alert>

                </v-flex>

              </v-layout>
            </v-container>

          </material-card>
        </v-form>
      </v-flex>
      <v-flex
        xs12
        md4
      >
        <material-card class="v-card-profile text-xs-center">
          <v-card-text>
            <h4 class="card-title font-weight-light">Profile</h4>
            <v-avatar
              slot="offset"
              class="mx-auto d-block"
              size="130"
            >
              <v-img
                :src="logo"
              />
            </v-avatar>
            <div/>
            <p class="display-1 text--primary">
              {{ user.first_name }} {{ user.surname }}
            </p>
            <h6 class="category text-gray font-weight-thin mb-3">{{ user.role.name }}</h6>
            <p class="card-description font-weight-light">Don't be scared of the truth because we need to restart the human foundation in truth</p>

          </v-card-text>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  //
  data () {
    return {
      logo: 'c4c_new.png',
      gender: [
        'MALE',
        'FEMALE',
        'UNDEFINED'
      ],
      roles: [
        { id: '1', name: 'Super Admin' },
        { id: '2', name: 'Partner Admin' },
        { id: '3', name: 'Health care worker' },
        { id: '4', name: 'Facility Admin' },
        { id: '5', name: 'County Admin' }
      ],
      select: { state: 'Flodrida' },
      all_facilities: [],
      all_cadres: [],
      userData: {
        first_name: '',
        surname: '',
        gender: '',
        email: '',
        role: '',
        facility_name: '',
        cadre: ''
      },
      output: '',
      alert: false
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },
  
  created () {
    this.getFacilities()
    this.getCadres()
    this.getUser()
  },

  methods: {
    getFacilities () {
      axios.get('facilities')
        .then((facilities) => {
          console.log(facilities.data)
          this.all_facilities = facilities.data.data
        })
        .catch(error => console.log(error.message))
    },

    getCadres () {
      axios.get('cadres')
        .then((cadres) => {
          console.log(cadres.data)
          this.all_cadres = cadres.data.data
        })
        .catch(error => console.log(error.message))
    },

    getUser () {
      axios.get('auth/user')
        .then((user) => {
          console.log(user.data)
          this.userData = user.data.data
        })
        .catch(error => console.log(error.message))
    },

    postUser (e) {
      e.preventDefault()

      let allData = new FormData();

       allData.append('first_name', this.user.first_name)
       allData.append('surname', this.user.surname)
       allData.append('gender', this.user.gender)
       allData.append('email', this.user.email)
       allData.append('role', this.user.role)
       allData.append('facility_name', this.user.hcw.fa)
       allData.append('cadre', this.user.cadre)

      axios({
        method: 'POST',
        url: 'auth/complete_profile',
        data: allData
      })
        .then((response) => {
          this.output = response.data
          this.alert = true
        })
        .catch(error => {
          this.output = error
          console.log(error)
        })
    }

  }
}
</script>
