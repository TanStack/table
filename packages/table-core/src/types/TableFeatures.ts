import type { CoreFeatures } from '../core/coreFeatures'
import type { CellData, RowData, UnionToIntersection } from './type-utils'
import type { ColumnDef, ColumnDefBase_All } from './ColumnDef'
import type { Cell } from './Cell'
import type { Column } from './Column'
import type { Header } from './Header'
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
    [K in keyof TFeatures]: TFeatures[K] extends TableFeature<
      infer FeatureConstructorOptions
    >
      ? TKey extends keyof FeatureConstructorOptions
        ? FeatureConstructorOptions[TKey]
        : never
      : any
  }[keyof TFeatures]
>

interface FeatureConstructors {
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
  extends Partial<CoreFeatures>,
    Partial<StockFeatures>,
    Partial<Plugins> {}

export type ConstructCellAPIs<TConstructors extends FeatureConstructors> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  cell: Cell<TFeatures, TData, TValue> &
    Partial<TConstructors['Cell']> & {
      row: Row<TFeatures, TData> & Partial<TConstructors['Row']>
      column: Column<TFeatures, TData, TValue> &
        Partial<TConstructors['Column']> & {
          columnDef: ColumnDef<TFeatures, TData, TValue> &
            Partial<TConstructors['ColumnDef']>
        }
    },
) => void

export type ConstructColumnAPIs<TConstructors extends FeatureConstructors> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue> &
    Partial<TConstructors['Column']> & {
      columnDef: ColumnDef<TFeatures, TData, TValue> &
        Partial<TConstructors['ColumnDef']>
    },
) => void

export type ConstructHeaderAPIs<TConstructors extends FeatureConstructors> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  header: Header<TFeatures, TData, TValue> &
    Partial<TConstructors['Header']> & {
      column: Column<TFeatures, TData, TValue> &
        Partial<TConstructors['Column']> & {
          columnDef: ColumnDef<TFeatures, TData, TValue> &
            Partial<TConstructors['ColumnDef']>
        }
    },
) => void

export type ConstructRowAPIs<TConstructors extends FeatureConstructors> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData> & Partial<TConstructors['Row']>,
) => void

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

export interface TableFeature<TConstructors extends FeatureConstructors> {
  constructCellAPIs?: ConstructCellAPIs<TConstructors>
  constructColumnAPIs?: ConstructColumnAPIs<TConstructors>
  constructHeaderAPIs?: ConstructHeaderAPIs<TConstructors>
  constructRowAPIs?: ConstructRowAPIs<TConstructors>
  constructTableAPIs?: ConstructTableAPIs<TConstructors>
  getDefaultColumnDef?: GetDefaultColumnDef<TConstructors>
  getDefaultTableOptions?: GetDefaultTableOptions<TConstructors>
  getInitialState?: GetInitialState<TConstructors>
}
