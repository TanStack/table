import { isDev } from 'solid-js/web'
import * as Devtools from './SolidTableDevtools'
import * as plugin from './plugin'

export const TableDevtoolsPanel = !isDev
  ? Devtools.TableDevtoolsPanelNoOp
  : Devtools.TableDevtoolsPanel

export const tableDevtoolsPlugin = !isDev
  ? plugin.tableDevtoolsNoOpPlugin
  : plugin.tableDevtoolsPlugin

export type { TableDevtoolsSolidInit } from './SolidTableDevtools'
export type { TableDevtoolsPluginOptions } from './plugin'
