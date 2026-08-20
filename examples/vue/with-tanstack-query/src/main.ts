import { createApp, defineComponent, h } from 'vue'
import { TanStackDevtools } from '@tanstack/vue-devtools'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { VueQueryDevtoolsPanel } from '@tanstack/vue-query-devtools'
import { tableDevtoolsPlugin } from '@tanstack/vue-table-devtools'
import App from './App.vue'
import './index.css'

const queryClient = new QueryClient()

const Root = defineComponent({
  setup() {
    return () => [
      h(App),
      h(TanStackDevtools, {
        plugins: [
          tableDevtoolsPlugin({}),
          {
            name: 'TanStack Query',
            component: VueQueryDevtoolsPanel,
          },
        ],
      }),
    ]
  },
})

createApp(Root).use(VueQueryPlugin, { queryClient }).mount('#app')
