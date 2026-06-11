import type { CoreFeatures } from '../core/coreFeatures'
import type { CellData, RowData, UnionToIntersection } from './type-utils'
import type { ColumnDefBase_All } from './ColumnDef'
import type { Row } from './Row'
import type { Table_Internal } from './Table'
import type { TableOptions_All } from './TableOptions'
import type { TableState_All } from './TableState'
import type { StockFeatures } from '../features/stockFeatures'

export type IsAny<T> = 0 extends 1 & T ? true : false
type UnionToIntersectionOrEmpty<T> = [T] extends [never]
  ? {}
  : UnionToIntersection<T> & {}

export type ExtractFeatureMapTypes<
  TFeatures extends TableFeatures,
  TFeatureMap extends object,
> =
  IsAny<TFeatures> extends true
    ? UnionToIntersection<TFeatureMap[keyof TFeatureMap]>
    : UnionToIntersectionOrEmpty<
        TFeatureMap[Extract<keyof TFeatures, keyof TFeatureMap>]
      >

export interface Plugins {}

export interface TableFeatures
  extends Partial<CoreFeatures>, Partial<StockFeatures>, Partial<Plugins> {
  /**
   * Type-only slot for declaring the type of this table's `options.meta`.
   *
   * Pass a phantom value: `tableMeta: {} as MyTableMeta`. The value itself is
   * ignored and stripped from the table's registered features at runtime — only
   * its type is used, inferred wherever `TFeatures` flows.
   *
   * When omitted, the global declaration-merged `TableMeta` interface applies.
   */
  tableMeta?: object
  /**
   * Type-only slot for declaring the type of `columnDef.meta` for all columns
   * of this table.
   *
   * Pass a phantom value: `columnMeta: {} as MyColumnMeta`. The value itself is
   * ignored and stripped from the table's registered features at runtime — only
   * its type is used, inferred wherever `TFeatures` flows.
   *
   * When omitted, the global declaration-merged `ColumnMeta` interface applies.
   */
  columnMeta?: object
}

export interface TableFeature {
  /**
   * Assigns Cell APIs to the cell prototype for memory-efficient method sharing.
   * This is called once per table to build a shared prototype for all cells.
   */
  assignCellPrototype?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    prototype: Record<string, any>,
    table: Table_Internal<TFeatures, TData>,
  ) => void
  /**
   * Assigns Column APIs to the column prototype for memory-efficient method sharing.
   * This is called once per table to build a shared prototype for all columns.
   */
  assignColumnPrototype?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    prototype: Record<string, any>,
    table: Table_Internal<TFeatures, TData>,
  ) => void
  /**
   * Assigns Header APIs to the header prototype for memory-efficient method sharing.
   * This is called once per table to build a shared prototype for all headers.
   */
  assignHeaderPrototype?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    prototype: Record<string, any>,
    table: Table_Internal<TFeatures, TData>,
  ) => void
  /**
   * Assigns Row APIs to the row prototype for memory-efficient method sharing.
   * This is called once per table to build a shared prototype for all rows.
   */
  assignRowPrototype?: <TFeatures extends TableFeatures, TData extends RowData>(
    prototype: Record<string, any>,
    table: Table_Internal<TFeatures, TData>,
  ) => void
  /**
   * Assigns Table APIs to the table instance.
   * Unlike row/cell/column/header, the table is a singleton so methods are assigned directly.
   */
  constructTableAPIs?: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table_Internal<TFeatures, TData>,
  ) => void
  getDefaultColumnDef?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >() => ColumnDefBase_All<TFeatures, TData, TValue>
  getDefaultTableOptions?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    table: Table_Internal<TFeatures, TData>,
  ) => Partial<TableOptions_All<TFeatures, TData>>
  getInitialState?: (initialState: Partial<TableState_All>) => TableState_All
  /**
   * Initializes instance-specific data on each row (e.g., caches).
   * Methods should be assigned via assignRowPrototype instead.
   */
  initRowInstanceData?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    row: Row<TFeatures, TData>,
  ) => void
}
