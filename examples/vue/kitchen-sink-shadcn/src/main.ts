import { createApp, defineComponent, h } from 'vue'
import { TanStackDevtools } from '@tanstack/vue-devtools'
import { tableDevtoolsPlugin } from '@tanstack/vue-table-devtools'
import App from './App.vue'
import { ThemeProvider } from './components/theme-provider'
import './index.css'

const Root = defineComponent({
  setup() {
    return () =>
      h(
        ThemeProvider,
        { defaultTheme: 'system', storageKey: 'vite-ui-theme' },
        () => [
          h(App),
          h(TanStackDevtools, {
            plugins: [tableDevtoolsPlugin({})],
          }),
        ],
      )
  },
})

createApp(Root).mount('#app')
