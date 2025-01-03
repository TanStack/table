import type { TableOptions_All } from './TableOptions'
import type { Table_Table } from '../core/table/coreTablesFeature.types'
import type { Table_Rows } from '../core/rows/coreRowsFeature.types'
import type { Table_Headers } from '../core/headers/coreHeadersFeature.types'
import type { Table_Columns } from '../core/columns/coreColumnsFeature.types'
import type { ExtractFeatureTypes, TableFeatures } from './TableFeatures'
import type { RowData } from './type-utils'
import type { TableState_All } from './TableState'
import type { RowModelFns_All } from './RowModelFns'
import type { CachedRowModel_All, CreateRowModels_All } from './RowModel'
import type { Table_RowModels } from '../core/row-models/coreRowModelsFeature.types'

/**
 * Use this interface as a target for declaration merging to add your own plugin properties.
 * Note: This will affect the types of all tables in your project.
 */
export interface Table_Plugins<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {}

/**
 * The core table object that only includes the core table functionality such as column, header, row, and table APIS.
 * No features are included.
 */
export type Table_Core<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Table_Table<TFeatures, TData> &
  Table_Columns<TFeatures, TData> &
  Table_Rows<TFeatures, TData> &
  Table_RowModels<TFeatures, TData> &
  Table_Headers<TFeatures, TData>

/**
 * The table object that includes both the core table functionality and the features that are enabled via the `_features` table option.
 */
export type Table<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Table_Core<TFeatures, TData> &
  ExtractFeatureTypes<TFeatures, 'Table'> &
  Table_Plugins<TFeatures, TData>

export type Table_Internal<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
> = Table<TFeatures, TData> & {
  _rowModels: CachedRowModel_All<TFeatures, TData>
  _rowModelFns: RowModelFns_All<TFeatures, TData>
  options: TableOptions_All<TFeatures, Array<TData>> & {
    _rowModels?: CreateRowModels_All<TFeatures, TData>
    state?: TableState_All
    initialState?: TableState_All
  }
  initialState: TableState_All
}
