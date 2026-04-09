import { createApp, defineComponent, h } from 'vue'
import { TanStackDevtools } from '@tanstack/vue-devtools'
import { tableDevtoolsPlugin } from '@tanstack/vue-table-devtools'
import App from './App.vue'

const Root = defineComponent({
  name: 'Root',
  setup() {
    return () => [
      h(App),
      h(TanStackDevtools, {
        plugins: [tableDevtoolsPlugin()],
      }),
    ]
  },
})

createApp(Root).mount('#app')
