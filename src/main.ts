import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUpload,faCheck, faTimes, faAngleDoubleUp, faAngleDoubleDown, faUndo, faRedo, faParagraph, faListOl, faListUl, faCode, faUnderline, faStrikethrough, faItalic, faBold, faQuoteLeft, faGripLines } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import VueAWN from "vue-awesome-notifications"

import 'nprogress/nprogress.css';

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

import setup from './utilities/math_round_extensions.js'
setup()

import { VueNotification } from '@/types/AwnTypes';

Vue.use(Buefy)

// require styles
import moment from 'moment'
import eventBus from "@/utilities/EventBus";

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('DD-MM-YYYY hh:mm:ss')
  }
})
// Your custom options
let options = {}

Vue.use(VueAWN, options)

library.add({faUpload, faCheck, faTimes, faAngleDoubleUp, faAngleDoubleDown, faUndo, faRedo, faParagraph, faListOl, faListUl, faCode, faUnderline, faStrikethrough, faItalic, faBold, faQuoteLeft, faGripLines})

Vue.component('font-awesome-icon', FontAwesomeIcon)

import { i18n } from './I18n/languages';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')