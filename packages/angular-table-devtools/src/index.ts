import { isDevMode } from '@angular/core'
import * as plugin from './plugin'
import * as Devtools from './TableDevtools'
import * as inject from './injectTanStackTableDevtools'

export const TableDevtoolsPanel: typeof Devtools.TableDevtoolsPanel =
  isDevMode() ? Devtools.TableDevtoolsPanel : Devtools.TableDevtoolsPanelNoOp

export const tableDevtoolsPlugin: typeof plugin.tableDevtoolsPlugin =
  isDevMode() ? plugin.tableDevtoolsPlugin : plugin.tableDevtoolsNoOpPlugin

export type { TableDevtoolsAngularInit } from './TableDevtools'

export type { InjectTanStackTableDevtoolsOptions } from './injectTanStackTableDevtools'

export const injectTanStackTableDevtools: typeof inject.injectTanStackTableDevtools =
  isDevMode()
    ? inject.injectTanStackTableDevtools
    : inject.injectTanStackTableDevtoolsNoOp
