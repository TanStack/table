'use client'

import * as Devtools from './core'
import type { ClassType } from '@tanstack/devtools-utils/solid'

export const TableDevtoolsCore: ClassType =
  process.env.NODE_ENV !== 'development'
    ? Devtools.TableDevtoolsCoreNoOp
    : Devtools.TableDevtoolsCore

export type { TableDevtoolsInit } from './core'
export { setTableDevtoolsTarget } from './tableTarget'
