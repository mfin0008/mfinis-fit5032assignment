import { useCurrentUser } from '@/composables/useCurrentUser'
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
      path: '/login',
      name: 'login',
      component: () => import ('../views/LoginView.vue'),
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: () => import('../views/SignUpSelectRoleView.vue'),
    },
    {
      path: '/sign-up-coach',
      name: 'sign-up-coach',
      component: () => import('../views/SignUpCoachView.vue'),
    },
    {
      path: '/sign-up-player',
      name: 'sign-up-player',
      component: () => import('../views/SignUpPlayerView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
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

router.beforeEach(async (to, from) => {
  const { isLoggedIn } = useCurrentUser();
  const SIGN_IN_ROUTES = ['login', 'sign-up', 'sign-up-coach', 'sign-up-player'];

  if (isLoggedIn.value && SIGN_IN_ROUTES.includes(to.name) && from.name !== 'profile') {
    return { name: 'profile' };
  }

  if (!isLoggedIn.value && to.name === 'profile') {
    return { name: 'login' };
  }
})
