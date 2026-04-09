import { createReactPlugin } from '@tanstack/devtools-utils/react'
import { TableDevtoolsPanel } from './ReactTableDevtools'

type TableDevtoolsPluginFactory = ReturnType<typeof createReactPlugin>[0]

const plugins = createReactPlugin({
  name: 'TanStack Table',
  Component: TableDevtoolsPanel,
})

export const tableDevtoolsPlugin: TableDevtoolsPluginFactory = plugins[0]
export const tableDevtoolsNoOpPlugin: TableDevtoolsPluginFactory = plugins[1]
