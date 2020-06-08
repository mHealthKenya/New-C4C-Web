<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="inputValue"
    app
    dark
    floating
    persistent
    mobile-break-point="991"
    width="270"
  >
    <v-img
      :src="image"
      height="100%"
    >
      <v-layout
        class="fill-height items"
        tag="v-list"
        column
      >
        <v-list-tile avatar>
          <v-list-tile-avatar
            color="white"
          >
            <v-img
              :src="logo"
              height="34"
              contain
            />
          </v-list-tile-avatar>
          <v-list-tile-title class="title">
            Care For The Carer
          </v-list-tile-title>
        </v-list-tile>
        <v-divider/>
        <div
          v-for="(link, i) in links"
          :key="i"
          dense>
          <v-list-tile
            v-if="link.text == 'Logout'"
            :active-class="color"
            avatar
            class="v-list-item"
          >
            <v-list-tile-action>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-title
              @click="logout"
              v-text="link.text"
            />
          </v-list-tile>
          <div v-else-if="(link.text == 'Manage Facility' || link.text == 'Resource Center') && user.role_id == 5"/>
          <v-list-tile
            v-else-if="!link.subLinks"
            :to="link.to"
            :active-class="color"
            avatar
            class="v-list-item"
          >
            <v-list-tile-action>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-title
              v-text="link.text"
            />
          </v-list-tile>
          <v-list-group
            v-else
            :key="link.text"
            no-action
          >
            <v-list-tile
              slot="activator"
              :active-class="color"
              class="v-list-item"
              avatar>
              <v-list-tile-action>
                <v-icon>{{ link.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ link.text }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <div
              v-for="sublink in link.subLinks"
              :key="sublink.text">
              <template
                v-if="(user.role_id === 4 || user.role_id === 5) && (sublink.text != 'Facility Admins' && sublink.text != 'View Users' && sublink.text != 'Checkin' && sublink.text != 'Facility Admins' )">
                <!-- {{drawerList(sublink.text)}} -->
                <v-list-tile
                  :to="sublink.to"
                  :active-class="color"
                  class="v-list-item"
                  avatar
                >
                  <v-list-tile-action>
                    <v-icon>{{ sublink.icon }}</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-title v-text="sublink.text" />
                </v-list-tile>
              </template>
              <template
                v-else-if="user.role_id != 4 && user.role_id != 5">
                <v-list-tile
                  :to="sublink.to"
                  :active-class="color"
                  class="v-list-item"
                  avatar
                >
                  <v-list-tile-action>
                    <v-icon>{{ sublink.icon }}</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-title v-text="sublink.text" />
                </v-list-tile>
              </template>
            </div>
          </v-list-group>
        </div>
      </v-layout>
    </v-img>
  </v-navigation-drawer>
</template>

<script>
// Utilities
import {
  mapMutations,
  mapState,
  mapActions,
  mapGetters
} from 'vuex'

export default {
  props: {
    opened: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      pre_out: '',
      logo: 'c4c_new.png',
      links: [
        {
          to: '/',
          icon: 'mdi-view-dashboard',
          text: 'Dashboard'
        },
        {
          to: '/all_broadcasts',
          icon: 'mdi-account-switch',
          text: 'Broadcasts'
        },
        {
          icon: 'mdi-account',
          text: 'Users',
          subLinks: [
            {
              text: 'Upload HCW',
              to: '/add-user',
              icon: 'mdi-account-plus'
            },
            // {
            //   to: '/users_list',
            //   icon: 'mdi-account-multiple-plus',
            //   text: 'View Users'
            // },
             {
              to: '/hcw_list',
              icon: 'mdi-account-group',
              text: 'Health Care Workers'
            }
          ]
        },
        {
          to: 'registration-reports',
          icon: 'mdi-transcribe',
          text: 'Registration Reports'
        },
        {
          icon: 'mdi-alert-circle-outline',
          text: 'Exposures',
          subLinks: [
            {
              text: 'Exposure report',
              to: '/exposures',
              icon: 'mdi-chart-bar'
            },
            {
              to: '/exposure-list',
              icon: 'mdi-playlist-check',
              text: 'Exposures List'
            }
          ]
        },
        {

          icon: 'mdi-account-edit',
          text: 'Immunizations',
          subLinks: [
            {
              text: 'HBV Reports',
              to: '/hbv-summary',
              icon: 'mdi-signal-hspa-plus'
            },
            {
              to: '/other-diseases',
              icon: 'mdi-chart-line',
              text: 'Other Diseases'
            }
          ]
        },
        {
          text: 'Manage Facility',
          icon: 'mdi-settings',
          subLinks: [
            // {
            //   to: '/add_device',
            //   icon: 'mdi-gamepad',
            //   text: 'Devices'
            // },
            // {
            //   to: '/departments',
            //   icon: 'mdi-file-tree',
            //   text: 'Departments'
            // },
            // {
            //   to: '/checkin',
            //   icon: 'mdi-crosshairs-gps',
            //   text: 'Checkin'
            // },
            {
              to: '/facility-admin',
              icon: 'mdi-lock-pattern',
              text: 'Facility Admins'
            }
          ]
        },
        {
          text: 'Resource Center',
          icon: 'mdi-arrow-down-bold-circle',
          subLinks: [
            {
              text: 'Public Resources',
              to: '/cmes',
              icon: 'mdi-animation'
            },
            {
              to: '/protocols',
              icon: 'mdi-archive',
              text: 'Facility Resources'
            },
            {
              to: '/covid19_resources',
              icon: 'mdi-alert-decagram',
              text: 'COVID 19 Resources'
            }
          ]
        },
        // {
        //   to: '/feed-back',
        //   icon: 'mdi-bullhorn',
        //   text: 'Feedback'
        // },
        {
          icon: 'mdi-clipboard-outline',
          text: 'Logout'
        }
      ]
    }
  },
  computed: {
    ...mapState('app', ['image', 'color']),
    ...mapGetters({
      user: 'auth/user'
    }),
    inputValue: {
      get () {
        return this.$store.state.app.drawer
      },
      set (val) {
        this.setDrawer(val)
      }
    },
    items () {
      return this.$t('Layout.View.items')
    }
  },
  created () {
    // this.drawerList()
  },
  methods: {
    ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
    ...mapActions({
      logoutAction: 'auth/signout'
    }),
    drawerList (ii) {
      console.log(ii)
      // if (this.user.role_id === 4){
      //   this.links[6].subLinks.splice(2, 1)
      //   this.links[7].subLinks.splice(2, 1)
      //   this.links[7].subLinks.splice(0, 1)
      //   console.log(this.links[7].subLinks)
      // }
    },
    logout () {
      this.logoutAction().then(() => {
        this.pre_out = 'Logged out!'
        this.$router.replace({
          name: 'login'
        })
      })
    }

  }
}
</script>

<style lang="scss">
  #app-drawer {
    .v-list__tile {
      border-radius: 4px;

      &--buy {
        margin-top: auto;
        margin-bottom: 17px;
      }
    }
  }
  .items {
    overflow: auto;
  }
</style>
