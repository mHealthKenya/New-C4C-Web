<template>
  <v-app
    id="login"
    class="log">
    <v-content>
      <v-container
        fluid
        fill-height>
        <v-layout
          align-center
          justify-center>
          <v-flex
            xs12
            sm8
            md4
            lg4>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center">
                  <v-img
                    :src="logo"
                    width="180"
                    height="180"/>
                  <h3 class="flex my-4 clo">Care for the Carer Login</h3>
                </div>
                <form>
                  <v-text-field
                    v-model="form.email"
                    :error="error"
                    :rules="[rules.required]"
                    append-icon="mdi-account"
                    name="email"
                    label="Email"
                    type="text"/>
                  <v-text-field
                    id="password"
                    :type="hidePassword ? 'password' : 'text'"
                    :append-icon="hidePassword ? 'mdi-eye-off' : 'mdi-eye'"
                    :rules="[rules.required]"
                    v-model="form.password"
                    :error="error"
                    name="password"
                    label="Password"
                    @click:append="hidePassword = !hidePassword"/>
                </form>
                <a
                  href="/forgot_password"
                  style="color: black">Forgot Your Password?</a>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  :loading="loading"
                  block
                  color="success"
                  @click.prevent="submit">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
       <v-footer
          id="core-footer"
          absolute
          height="82"
        >
          <div class="footer-items">
            <span
              v-for="link in links"
              :key="link.name"
            >
              <a
                :href="link.Link"
                class="tertiary--text footer-links">{{ link.name }}</a>
            </span>
          </div>

          <v-spacer/>
          <span class="font-weight-light copyright">
            &copy;
            {{ (new Date()).getFullYear() }}
            <a
              href="https://www.mhealthkenya.org/"
              target="_blank">m-Health Kenya </a>
          </span>
        </v-footer>
      <v-snackbar
        :color="'#f55a4e'"
        v-model="showResult"
        :timeout="2000"
        top>
        {{ result }}
      </v-snackbar>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      links: [
        { name: 'About Us', Link: 'https://www.mhealthkenya.org/why-choose-us' },
        { name: 'Publication', Link: 'https://www.mhealthkenya.org/news-publications' }
      ],
      logo: 'c4c_new.png',
      loading: false,
      form: {
        email: '',
        password: ''
      },
      hidePassword: true,
      error: false,
      showResult: false,
      result: '',
      rules: {
        required: value => !!value || 'Required.'
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },
  methods: {
    ...mapActions({
      signIn: 'auth/signIn'
    }),
    submit () {
      const vm = this

      if (!vm.form.email || !vm.form.password) {
        vm.result = "Email and Password can't be empty."
        vm.showResult = true
        return
      }

      this.signIn(this.form)
        .then(() => {
          this.$router.replace({
            name: 'Dashboard'
          })
          console.log(user)
        })
        .catch(() => {
          vm.error = true
          vm.result = 'Email or Password is incorrect.'
          vm.showResult = true
          vm.snackbar = true
        })
    }
  }
}
</script>

<style scoped lang="css">
  #login {
    height: 50%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    z-index: 0;
  }
</style>
