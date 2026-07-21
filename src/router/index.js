import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/newsletter',
    name: 'Newsletter',
    component: () => import('../views/CategoryView.vue'),
    meta: { contentType: 'newsletter' }
  },
  {
    path: '/newsletter/:slug',
    name: 'NewsletterSingle',
    component: () => import('../views/CategorySingleView.vue'),
    meta: { contentType: 'newsletter' }
  },
  {
    path: '/articles',
    name: 'Articles',
    component: () => import('../views/CategoryView.vue'),
    meta: { contentType: 'article' }
  },
  {
    path: '/articles/:slug',
    name: 'ArticleSingle',
    component: () => import('../views/CategorySingleView.vue'),
    meta: { contentType: 'article' }
  },
  {
    path: '/messages',
    name: 'Messages',
    component: () => import('../views/CategoryView.vue'),
    meta: { contentType: 'message' }
  },
  {
    path: '/messages/:slug',
    name: 'MessageSingle',
    component: () => import('../views/CategorySingleView.vue'),
    meta: { contentType: 'message' }
  },
  {
    path: '/programs',
    name: 'Programs',
    component: () => import('../views/ProgramsView.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
