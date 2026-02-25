'use client'

import * as Devtools from './core'

export const TableDevtoolsCore =
  process.env.NODE_ENV !== 'development'
    ? Devtools.TableDevtoolsCoreNoOp
    : Devtools.TableDevtoolsCore

export type { TableDevtoolsInit } from './core'
export { setTableDevtoolsTarget } from './tableTarget'
