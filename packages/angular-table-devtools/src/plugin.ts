import { createAngularPlugin } from '@tanstack/devtools-utils/angular'
import { TableDevtoolsPanel } from './TableDevtools'

type TableDevtoolsPluginFactory = ReturnType<typeof createAngularPlugin>[0]

const plugins = createAngularPlugin({
  name: 'TanStack Table',
  render: TableDevtoolsPanel,
})

export const tableDevtoolsPlugin: TableDevtoolsPluginFactory = plugins[0]
export const tableDevtoolsNoOpPlugin: TableDevtoolsPluginFactory =
  plugins[1] as any
