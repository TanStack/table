declare module '@tanstack/table-devtools' {
  import type { ClassType } from '@tanstack/devtools-utils/solid'
  import type { RowData, Table, TableFeatures } from '@tanstack/table-core'

  export const TableDevtoolsCore: ClassType

  export interface TableDevtoolsRegistration {
    id: string
    table: Table<TableFeatures, RowData>
    name?: string
    fallbackName: string
  }

  export interface UpsertTableDevtoolsTargetOptions {
    id: string
    table: Table<TableFeatures, RowData>
    name?: string
  }

  export function upsertTableDevtoolsTarget(
    options: UpsertTableDevtoolsTargetOptions,
  ): void

  export function removeTableDevtoolsTarget(id: string): void
}
