import { assignAPIs } from '../../utils'
import { table_reset, table_setOptions } from './coreTablesFeature.utils'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
// import type { TableOptions_Table, Table_Table } from './coreTablesFeature.types'

interface CoreTablesFeatureConstructors<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  // Table: Table_Table<TFeatures, TData>
  // TableOptions: TableOptions_Table<TFeatures, TData>
}

export function constructCoreTablesFeature<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): TableFeature<CoreTablesFeatureConstructors<TFeatures, TData>> {
  return {
    constructTableAPIs: (table) => {
      assignAPIs('coreTablesFeature', table, {
        table_reset: {
          fn: () => table_reset(table),
        },
        table_setOptions: {
          fn: (updater) => table_setOptions(table, updater),
        },
      })
    },
  }
}

/**
 * The Core Tables feature provides the core table functionality for handling state and options.
 */
export const coreTablesFeature = constructCoreTablesFeature()
