import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

import Vue from 'vue'
import CKEditor from '@ckeditor/ckeditor5-vue'

// Components
import './components'

// Plugins
import './plugins'
import { sync } from 'vuex-router-sync'
import VuetifyDaterangePicker from 'vuetify-daterange-picker'
import 'vuetify-daterange-picker/dist/vuetify-daterange-picker.css'

// Application imports
import App from './App'
import router from '@/router'
import store from './store'
import axios from 'axios'

Vue.use(VuetifyDaterangePicker)

require('@/store/subscriber')

axios.defaults.baseURL = 'https://c4c-api.mhealthkenya.co.ke/api'
Vue.use(VuetifyDaterangePicker)

delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

// Sync store with router
sync(store, router)

Vue.config.productionTip = false

store.dispatch('auth/attempt', localStorage.getItem('token'))

Vue.use(CKEditor)

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
