import { createRouter,createWebHashHistory} from 'vue-router'



// Import views
import HomeView from '../views/HomeView.vue'
import NewsletterView from '../views/NewsletterView.vue'
import NewsletterSingleView from '../views/NewsletterSingleView.vue'



const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/newsletter',
    name: 'Newsletter',
    component: NewsletterView,
    
  },
    {
    path: '/newsletter/:slug',
    name: 'NewsletterSingle',
    component: NewsletterSingleView,
    
  },
]

const router = createRouter({

  history: createWebHashHistory(import.meta.env.BASE_URL),

  routes
})


export default router



