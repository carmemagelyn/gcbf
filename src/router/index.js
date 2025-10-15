import { createRouter, createWebHashHistory } from 'vue-router'
import { isAuthenticated, getCurrentUser, isAdmin } from '../utils/auth'

// Import views
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import GivingView from '../views/GivingView.vue'
import BibleReadingView from '../views/BibleReadingView.vue'
import PrayerListView from '../views/PrayerListView.vue'
import ChurchPortalView from '../views/ChurchPortalView.vue'
import AdminLoginView from '../views/AdminLoginView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next('/dashboard')
      } else {
        next()
      }
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next('/dashboard')
      } else {
        next()
      }
    }
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
  },
  {
    path: '/admin-login',
    name: 'AdminLogin',
    component: AdminLoginView,
    beforeEnter: (to, from, next) => {
      const user = getCurrentUser()
      if (user && user.userType === 'admin') {
        next('/church-portal')
      } else {
        next()
      }
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      // Redirect to admin login for admin routes, regular login for others
      if (to.matched.some(record => record.meta.requiresAdmin)) {
        next('/admin-login')
      } else {
        next('/login')
      }
    } else if (to.matched.some(record => record.meta.requiresAdmin)) {
      // Check if user is admin for admin routes
      if (!isAdmin()) {
        next('/admin-login')
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