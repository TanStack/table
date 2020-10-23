import { TableConfig, TableInstance, TablePlugin } from '../../types'
import { createTable } from '../createTable'

interface MyPluginOptions extends TableConfig {
  tanner?: boolean
}

interface MyPluginInstance extends TableInstance {
  plug
}

const myPlugin = {
  name: 'tanner',
  init: (instance: MyPluginInstance, options: MyPluginOptions) => {
    instance.plug.useInstanceAfterState.push(instance => {
      if (instance.config.tanner) {
        instance.hasTanner = true
      }
      return instance
    })

    return instance
  },
}

const useTable = createTable({
  plugins: [myPlugin],
})

function App() {
  const tableInstance = useTable({
    data: [],
    columns: [],
  })

  console.log(tableInstance)
}
