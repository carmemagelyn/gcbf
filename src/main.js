import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { createHead } from '@vueuse/head'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const head = createHead()

// Disable Vue devtools in production
app.config.devtools = false

app.use(router)
app.mount('#app')
app.use(head)
