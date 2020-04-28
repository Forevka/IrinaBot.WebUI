import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'nprogress/nprogress.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faTimes, faAngleDoubleUp, faAngleDoubleDown, faUndo, faRedo, faParagraph, faListOl, faListUl, faCode, faUnderline, faStrikethrough, faItalic, faBold, faQuoteLeft, faGripLines } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import setup from './utilities/math_round_extensions.js'
import { VueNotification } from '@/types/AwnTypes';
import VueDraggableResizable from 'vue-draggable-resizable'
import VueAWN from "vue-awesome-notifications"

// optionally import default styles
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

Vue.component('vue-draggable-resizable', VueDraggableResizable)
// require styles
import moment from 'moment'
import eventBus from "@/utilities/EventBus";
import { Player } from './models/responses/GameModel';

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('DD-MM-YYYY hh:mm:ss')
  }
})

Vue.filter('formatPlayerName', function(players: Player[]) {
  let res: string = "";
  players.forEach(element => {
    res += element.name + " ";
  });

  return res;
})
// Your custom options
let options = {}

Vue.use(VueAWN, options)

setup()

library.add({faCheck, faTimes, faAngleDoubleUp, faAngleDoubleDown, faUndo, faRedo, faParagraph, faListOl, faListUl, faCode, faUnderline, faStrikethrough, faItalic, faBold, faQuoteLeft, faGripLines})

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')