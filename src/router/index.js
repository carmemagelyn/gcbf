import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated, getCurrentUser, isAdmin } from '../utils/auth'

// Import views
import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'
import GivingView from '../views/GivingView.vue'
import BibleReadingView from '../views/BibleReadingView.vue'
import PrayerListView from '../views/PrayerListView.vue'
import ChurchPortalView from '../views/ChurchPortalView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/giving',
    name: 'Giving',
    component: GivingView,
    meta: { requiresAuth: true }
  },
  {
    path: '/pledge',
    redirect: '/giving'
  },
  {
    path: '/bible-reading',
    name: 'BibleReading',
    component: BibleReadingView,
    meta: { requiresAuth: true }
  },
  {
    path: '/prayer-list',
    name: 'PrayerList',
    component: PrayerListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/church-portal',
    name: 'ChurchPortal',
    component: ChurchPortalView,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      // Redirect to home where users can login via modal
      next('/')
    } else if (to.matched.some(record => record.meta.requiresAdmin)) {
      // Check if user is admin for admin routes
      if (!isAdmin()) {
        next('/dashboard')
      } else {
        next()
      }
    } else if (to.matched.some(record => record.meta.requiresMember)) {
      const user = getCurrentUser()
      if (user.userType !== 'member') {
        next('/dashboard')
      } else {
        next()
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router