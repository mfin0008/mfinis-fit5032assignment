import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/sign-up-player',
      name: 'sign-up-player',
      component: () => import('../views/SignUpPlayerView.vue'),
    },
    {
      path: '/team',
      name: 'team',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/fixture',
      name: 'fixture',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/standings',
      name: 'standings',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/venues',
      name: 'venues',
      component: () => import('../views/HomeView.vue'),
    },
  ],
})

export default router
