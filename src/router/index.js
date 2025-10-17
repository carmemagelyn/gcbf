import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated, getCurrentUser, isAdmin, isAdminOrPastor } from '../utils/auth'

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
    meta: { requiresAuth: true, requiresAdminOrPastor: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  console.log('Navigation to:', to.path, 'from:', from.path)
  
  // Check if route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      // Not logged in - redirect to home
      console.log('Not authenticated - redirecting to home')
      next('/')
      return
    }
    
    // User is authenticated - now check specific permissions
    const user = getCurrentUser()
    console.log('User authenticated:', user?.email, 'Type:', user?.userType)
    
    // Check if route requires admin or pastor access
    if (to.matched.some(record => record.meta.requiresAdminOrPastor)) {
      if (!isAdminOrPastor()) {
        // Not admin/pastor - redirect based on user type
        console.log('Route requires admin/pastor - user is not authorized')
        next(user.userType === 'member' ? '/dashboard' : '/')
        return
      }
    }
    
    // Check if route requires admin-only access
    if (to.matched.some(record => record.meta.requiresAdmin)) {
      if (!isAdmin()) {
        // Not admin - redirect based on user type
        console.log('Route requires admin - user is not authorized')
        if (user.userType === 'pastor') {
          next('/church-portal')
        } else if (user.userType === 'member') {
          next('/dashboard')
        } else {
          next('/')
        }
        return
      }
    }
    
    // Check if route requires member-only access
    if (to.matched.some(record => record.meta.requiresMember)) {
      if (user.userType !== 'member') {
        // Not a member - redirect admin/pastor to church portal
        console.log('Route requires member - redirecting admin/pastor to church portal')
        next('/church-portal')
        return
      }
    }
    
    // All checks passed - allow navigation
    console.log('All checks passed - allowing navigation')
    next()
  } else {
    // Route doesn't require auth - allow navigation
    console.log('Route does not require auth - allowing navigation')
    next()
  }
})

export default router