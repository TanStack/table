'use client'

export { TableDevtoolsCore } from './core'

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
