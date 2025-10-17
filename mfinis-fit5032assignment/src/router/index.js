import { useCurrentUser } from '@/composables/useCurrentUser'
import { isRole } from '@/firebase/collections/users'
import { createRouter, createWebHistory } from 'vue-router'
import { Roles } from '../../shared/constants'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'admin-dashboard',
      component: () => import('../views/AdminDashboard.vue'),
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
  const { user, isLoggedIn } = useCurrentUser();
  const SIGN_IN_ROUTES = ['login', 'sign-up', 'sign-up-coach', 'sign-up-player'];
  const AUTH_LOCKED_ROUTES = ['profile', 'team', 'fixture'];
  const ADMIN_ONLY_ROUTES = ['admin-dashboard'];

  if (isLoggedIn.value && SIGN_IN_ROUTES.includes(to.name) && from.name !== 'profile') {
    return { name: 'profile' };
  }

  if (!isLoggedIn.value && AUTH_LOCKED_ROUTES.includes(to.name)) {
    return { name: 'login' };
  }

  if (ADMIN_ONLY_ROUTES.includes(to.name) && !(await isRole(user.value.uid, Roles.ADMIN))) {
    return { name: 'profile' };
  }
})
