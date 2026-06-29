declare module '@tanstack/table-devtools' {
  import type { ClassType } from '@tanstack/devtools-utils/solid'
  import type { RowData, Table, TableFeatures } from '@tanstack/table-core'

  export const TableDevtoolsCore: ClassType

  export interface TableDevtoolsTable {
    options: {
      key?: string
      [key: string]: unknown
    }
  }

  export interface TableDevtoolsRegistration {
    id: string
    table: TableDevtoolsTable
  }

  export interface UpsertTableDevtoolsTargetOptions<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    table: Table<TFeatures, TData>
  }

  export function upsertTableDevtoolsTarget<
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    options: UpsertTableDevtoolsTargetOptions<TFeatures, TData>,
  ): (() => void) | undefined

  export function removeTableDevtoolsTarget(id: string): void
}
