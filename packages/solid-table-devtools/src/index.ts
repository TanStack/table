import * as Devtools from './TableDevtools'
import * as plugin from './plugin'

export const TableDevtoolsPanel: typeof Devtools.TableDevtoolsPanel =
  process.env.NODE_ENV !== 'development'
    ? Devtools.TableDevtoolsPanelNoOp
    : Devtools.TableDevtoolsPanel

export const tableDevtoolsPlugin: typeof plugin.tableDevtoolsPlugin =
  process.env.NODE_ENV !== 'development'
    ? plugin.tableDevtoolsNoOpPlugin
    : plugin.tableDevtoolsPlugin

export type { TableDevtoolsSolidInit } from './TableDevtools'
export type { TableDevtoolsPluginOptions } from './plugin'
