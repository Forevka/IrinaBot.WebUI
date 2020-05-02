import Vue from 'vue'
import VueRouter from 'vue-router'
import GamesListView from '../views/GamesListView.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/notfound',
    name: 'notfound',
    component: () => import('../views/NotFoundView.vue'),  
    props: true
  },
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/games',
    name: 'games',
    component: GamesListView
  },
  {
    path: '/discord',
    name: 'discordAuth',
    component: () => import('../views/DiscordAuthView.vue')
  },
  {
    path: '*',
    name: 'notfound_wildcard',
    component: () => import('../views/NotFoundView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
