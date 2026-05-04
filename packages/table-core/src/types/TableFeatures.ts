import type { CoreFeatures } from '../core/coreFeatures'
import type { CellData, RowData, UnionToIntersection } from './type-utils'
import type { ColumnDefBase_All } from './ColumnDef'
import type { Row } from './Row'
import type { Table_Internal } from './Table'
import type { TableOptions_All } from './TableOptions'
import type { TableState_All } from './TableState'
import type { StockFeatures } from '../features/stockFeatures'

export type ExtractFeatureTypes<
  TKey extends keyof FeatureConstructors,
  TFeatures extends TableFeatures,
> = UnionToIntersection<
  {
    [K in keyof TFeatures]: K extends 'coreReativityFeature'
      ? never
      : TFeatures[K] extends TableFeature<infer FeatureConstructorOptions>
        ? TKey extends keyof FeatureConstructorOptions
          ? FeatureConstructorOptions[TKey]
          : never
        : any
  }[keyof TFeatures]
>

export interface FeatureConstructors {
  CachedRowModel?: any
  Cell?: any
  Column?: any
  ColumnDef?: any
  CreateRowModels?: any
  Header?: any
  HeaderGroup?: any
  Row?: any
  RowModelFns?: any
  Table?: any
  TableOptions?: any
  TableState?: any
}

export interface Plugins {}

export interface TableFeatures
  extends Partial<CoreFeatures>, Partial<StockFeatures>, Partial<Plugins> {}

export type ConstructTableAPIs<TConstructors extends FeatureConstructors> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData> &
    Partial<TConstructors['Table']> & {
      options: Partial<TConstructors['TableOptions']>
    },
) => void

export type GetDefaultColumnDef<TConstructors extends FeatureConstructors> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>() => ColumnDefBase_All<TFeatures, TData, TValue> &
  Partial<TConstructors['ColumnDef']>

export type GetDefaultTableOptions<TConstructors extends FeatureConstructors> =
  <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table_Internal<TFeatures, TData> & Partial<TConstructors['Table']>,
  ) => Partial<TableOptions_All<TFeatures, TData>> &
    Partial<TConstructors['TableOptions']>

export type GetInitialState<TConstructors extends FeatureConstructors> = (
  initialState: Partial<TableState_All> & Partial<TConstructors['TableState']>,
) => TableState_All & Partial<TConstructors['TableState']>

export type GetDefaultStateSelector<TConstructors extends FeatureConstructors> =
  (
    state: TableState_All,
  ) => Partial<TableState_All> & Partial<TConstructors['TableState']>

export type AssignCellPrototype<TConstructors extends FeatureConstructors> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  prototype: Record<string, any>,
  table: Table_Internal<TFeatures, TData>,
) => void

export type AssignColumnPrototype<TConstructors extends FeatureConstructors> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  prototype: Record<string, any>,
  table: Table_Internal<TFeatures, TData>,
) => void

export type AssignHeaderPrototype<TConstructors extends FeatureConstructors> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  prototype: Record<string, any>,
  table: Table_Internal<TFeatures, TData>,
) => void

export type AssignRowPrototype<TConstructors extends FeatureConstructors> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  prototype: Record<string, any>,
  table: Table_Internal<TFeatures, TData>,
) => void

export type InitRowInstanceData<TConstructors extends FeatureConstructors> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData> & Partial<TConstructors['Row']>,
) => void

export interface TableFeature<TConstructors extends FeatureConstructors> {
  /**
   * Assigns Cell APIs to the cell prototype for memory-efficient method sharing.
   * This is called once per table to build a shared prototype for all cells.
   */
  assignCellPrototype?: AssignCellPrototype<TConstructors>
  /**
   * Assigns Column APIs to the column prototype for memory-efficient method sharing.
   * This is called once per table to build a shared prototype for all columns.
   */
  assignColumnPrototype?: AssignColumnPrototype<TConstructors>
  /**
   * Assigns Header APIs to the header prototype for memory-efficient method sharing.
   * This is called once per table to build a shared prototype for all headers.
   */
  assignHeaderPrototype?: AssignHeaderPrototype<TConstructors>
  /**
   * Assigns Row APIs to the row prototype for memory-efficient method sharing.
   * This is called once per table to build a shared prototype for all rows.
   */
  assignRowPrototype?: AssignRowPrototype<TConstructors>
  /**
   * Assigns Table APIs to the table instance.
   * Unlike row/cell/column/header, the table is a singleton so methods are assigned directly.
   */
  constructTableAPIs?: ConstructTableAPIs<TConstructors>
  getDefaultColumnDef?: GetDefaultColumnDef<TConstructors>
  getDefaultTableOptions?: GetDefaultTableOptions<TConstructors>
  getInitialState?: GetInitialState<TConstructors>
  /**
   * Initializes instance-specific data on each row (e.g., caches).
   * Methods should be assigned via assignRowPrototype instead.
   */
  initRowInstanceData?: InitRowInstanceData<TConstructors>
}
