'use client'

import * as Devtools from './SolidTableDevtools'
import * as plugin from './plugin'

export const TableDevtoolsPanel =
  process.env.NODE_ENV !== 'development'
    ? Devtools.TableDevtoolsPanelNoOp
    : Devtools.TableDevtoolsPanel

export const tableDevtoolsPlugin =
  process.env.NODE_ENV !== 'development'
    ? plugin.tableDevtoolsNoOpPlugin
    : plugin.tableDevtoolsPlugin

export type { TableDevtoolsSolidInit } from './SolidTableDevtools'
export type { TableDevtoolsPluginOptions } from './plugin'
