import { createRouter, createWebHistory } from 'vue-router'

// Import views
import HomeView from '../views/HomeView.vue'
import CategoryView from '../views/CategoryView.vue'
import CategorySingleView from '../views/CategorySingleView.vue'
import ProgramsView from '../views/ProgramsView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/newsletter',
    name: 'Newsletter',
    component: CategoryView,
    meta: { contentType: 'newsletter' }
  },
  {
    path: '/newsletter/:slug',
    name: 'NewsletterSingle',
    component: CategorySingleView,
    meta: { contentType: 'newsletter' }
  },
  {
    path: '/articles',
    name: 'Articles',
    component: CategoryView,
    meta: { contentType: 'article' }
  },
  {
    path: '/articles/:slug',
    name: 'ArticleSingle',
    component: CategorySingleView,
    meta: { contentType: 'article' }
  },
  {
    path: '/messages',
    name: 'Messages',
    component: CategoryView,
    meta: { contentType: 'message' }
  },
  {
    path: '/messages/:slug',
    name: 'MessageSingle',
    component: CategorySingleView,
    meta: { contentType: 'message' }
  },
  {
    path: '/programs',
    name: 'Programs',
    component: ProgramsView
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
