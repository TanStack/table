import { createReactPlugin } from '@tanstack/devtools-utils/react'
import { TableDevtoolsPanel } from './ReactTableDevtools'

type TableDevtoolsPluginFactory = ReturnType<typeof createReactPlugin>[0]

const [plugin] = createReactPlugin({
  name: 'TanStack Table',
  Component: TableDevtoolsPanel,
})

export const tableDevtoolsPlugin: TableDevtoolsPluginFactory = plugin
