'use client'

export { TableDevtoolsCore } from './core'

export type { TableDevtoolsInit } from './core'
export {
  getTableDevtoolsTargets,
  removeTableDevtoolsTarget,
  setTableDevtoolsTarget,
  subscribeTableDevtoolsTargets,
  upsertTableDevtoolsTarget,
} from './tableTarget'
export type {
  TableDevtoolsRegistration,
  TableDevtoolsStore,
  TableDevtoolsTable,
  UpsertTableDevtoolsTargetOptions,
} from './tableTarget'
