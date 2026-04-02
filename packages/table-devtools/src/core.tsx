import { constructCoreClass } from '@tanstack/devtools-utils/solid'
import { lazy } from 'solid-js'
import type { ClassType } from '@tanstack/devtools-utils/solid'

const Component = lazy(() => import('./TableDevtools'))

export interface TableDevtoolsInit {}

const coreClasses = constructCoreClass(Component.preload)

export const TableDevtoolsCore: ClassType = coreClasses[0]
export const TableDevtoolsCoreNoOp: ClassType = coreClasses[1]
