'use client'

import * as Devtools from './core'
import type { ClassType } from '@tanstack/devtools-utils/solid'

export const TableDevtoolsCore: ClassType =
  process.env.NODE_ENV !== 'development'
    ? Devtools.TableDevtoolsCoreNoOp
    : Devtools.TableDevtoolsCore

export type { TableDevtoolsInit } from './core'
export {
  createTableDevtoolsRegistrationManager,
  getTableDevtoolsTargets,
  removeTableDevtoolsTarget,
  setTableDevtoolsTarget,
  subscribeTableDevtoolsTargets,
  upsertTableDevtoolsTarget,
} from './tableTarget'
export type {
  TableDevtoolsRegistration,
  TableDevtoolsRegistrationManager,
  TableDevtoolsStore,
  TableDevtoolsTable,
  UpsertTableDevtoolsTargetOptions,
} from './tableTarget'
