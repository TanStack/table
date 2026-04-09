import * as Devtools from './VueTableDevtools'
import * as plugin from './plugin'
import * as hook from './useTanStackTableDevtools'

export const TableDevtoolsPanel =
  process.env.NODE_ENV !== 'development'
    ? Devtools.TableDevtoolsPanelNoOp
    : Devtools.TableDevtoolsPanel

export const tableDevtoolsPlugin =
  process.env.NODE_ENV !== 'development'
    ? plugin.tableDevtoolsNoOpPlugin
    : plugin.tableDevtoolsPlugin

export const useTanStackTableDevtools =
  process.env.NODE_ENV !== 'development'
    ? hook.useTanStackTableDevtoolsNoOp
    : hook.useTanStackTableDevtools

export type { TableDevtoolsVueInit } from './VueTableDevtools'
export type { UseTanStackTableDevtoolsOptions } from './useTanStackTableDevtools'
