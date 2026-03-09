import { constructCoreClass } from '@tanstack/devtools-utils/solid'
import { lazy } from 'solid-js'

const Component = lazy(() => import('./TableDevtools'))

export interface TableDevtoolsInit {}

const [TableDevtoolsCore, TableDevtoolsCoreNoOp] = constructCoreClass(
  Component.preload,
)

export { TableDevtoolsCore, TableDevtoolsCoreNoOp }
