import * as Devtools from './TableDevtools'
import * as plugin from './plugin'
import * as hook from './useTanStackTableDevtools'

export const TableDevtoolsPanel: typeof Devtools.TableDevtoolsPanel =
  process.env.NODE_ENV !== 'development'
    ? Devtools.TableDevtoolsPanelNoOp
    : Devtools.TableDevtoolsPanel

export const tableDevtoolsPlugin: typeof plugin.tableDevtoolsPlugin =
  process.env.NODE_ENV !== 'development'
    ? plugin.tableDevtoolsNoOpPlugin
    : plugin.tableDevtoolsPlugin

export const useTanStackTableDevtools: typeof hook.useTanStackTableDevtools =
  process.env.NODE_ENV !== 'development'
    ? hook.useTanStackTableDevtoolsNoOp
    : hook.useTanStackTableDevtools

export type { TableDevtoolsSolidInit } from './TableDevtools'
export type { UseTanStackTableDevtoolsOptions } from './useTanStackTableDevtools'
