import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

const queryClient = new QueryClient()

createApp(App).use(VueQueryPlugin, { queryClient }).mount('#app')
