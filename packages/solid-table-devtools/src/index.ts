import { isDev } from 'solid-js/web'
import * as plugin from './plugin'
import * as Devtools from './TableDevtools'

export const TableDevtoolsPanel = !isDev
  ? Devtools.TableDevtoolsPanelNoOp
  : Devtools.TableDevtoolsPanel

export const tableDevtoolsPlugin = !isDev
  ? plugin.tableDevtoolsNoOpPlugin
  : plugin.tableDevtoolsPlugin

export type { TableDevtoolsSolidInit } from './TableDevtools'
export type { TableDevtoolsPluginOptions } from './plugin'
