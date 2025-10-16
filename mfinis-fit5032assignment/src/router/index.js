import { useCurrentUser } from '@/composables/useCurrentUser'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/ProfileView.vue'),
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
      component: () => import('../views/TeamView.vue'),
    },
    {
      path: '/fixture',
      name: 'fixture',
      component: () => import('../views/FixtureView.vue'),
    },
    {
      path: '/standings',
      name: 'standings',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/venues',
      name: 'venues',
      component: () => import('../views/VenuesView.vue'),
    },
  ],
})

export default router

router.beforeEach(async (to, from) => {
  const { isLoggedIn } = useCurrentUser();
  const SIGN_IN_ROUTES = ['login', 'sign-up', 'sign-up-coach', 'sign-up-player'];
  const AUTH_LOCKED_ROUTES = ['profile', 'team', 'fixture'];

  if (isLoggedIn.value && SIGN_IN_ROUTES.includes(to.name) && from.name !== 'profile') {
    return { name: 'profile' };
  }

  if (!isLoggedIn.value && AUTH_LOCKED_ROUTES.includes(to.name)) {
    return { name: 'login' };
  }
})
