declare module '@tanstack/table-devtools' {
  import type { ClassType } from '@tanstack/devtools-utils/solid'
  import type { RowData, Table, TableFeatures } from '@tanstack/table-core'

  export const TableDevtoolsCore: ClassType

  export interface TableDevtoolsRegistration {
    id: string
    table: Table<TableFeatures, RowData>
  }

  export interface UpsertTableDevtoolsTargetOptions {
    table: Table<TableFeatures, RowData>
  }

  export function upsertTableDevtoolsTarget(
    options: UpsertTableDevtoolsTargetOptions,
  ): (() => void) | undefined

  export function removeTableDevtoolsTarget(id: string): void
}
