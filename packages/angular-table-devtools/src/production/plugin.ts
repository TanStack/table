import { createAngularPlugin } from '@tanstack/devtools-utils/angular'
import { TableDevtoolsPanel } from './TableDevtools'

type TableDevtoolsPluginFactory = ReturnType<typeof createAngularPlugin>[0]

const [plugin] = createAngularPlugin({
  name: 'TanStack Table',
  render: TableDevtoolsPanel,
})

export const tableDevtoolsPlugin: TableDevtoolsPluginFactory = plugin
