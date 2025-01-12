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
  TKey extends keyof FeatureConstructors<TData, TValue>,
  TFeatures extends TableFeatures,
  TData extends RowData = RowData,
  TValue extends CellData = CellData,
> = UnionToIntersection<
  {
    [K in keyof TFeatures]: TFeatures[K] extends TableFeature<
      infer FeatureConstructorOptions,
      TData,
      TValue
    >
      ? TKey extends keyof FeatureConstructorOptions
        ? FeatureConstructorOptions[TKey]
        : never
      : any
  }[keyof TFeatures]
>

export interface FeatureConstructors<
  TData extends RowData,
  TValue extends CellData = CellData,
> {
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

export type ConstructCellAPIs<
  TConstructors extends FeatureConstructors<TData, TValue>,
  TData extends RowData,
  TValue extends CellData = CellData,
> = <TFeatures extends TableFeatures>(
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

export type ConstructColumnAPIs<
  TConstructors extends FeatureConstructors<TData, TValue>,
  TData extends RowData,
  TValue extends CellData = CellData,
> = <TFeatures extends TableFeatures>(
  column: Column<TFeatures, TData, TValue> &
    Partial<TConstructors['Column']> & {
      columnDef: ColumnDef<TFeatures, TData, TValue> &
        Partial<TConstructors['ColumnDef']>
    },
) => void

export type ConstructHeaderAPIs<
  TConstructors extends FeatureConstructors<TData, TValue>,
  TData extends RowData,
  TValue extends CellData = CellData,
> = <TFeatures extends TableFeatures>(
  header: Header<TFeatures, TData, TValue> &
    Partial<TConstructors['Header']> & {
      column: Column<TFeatures, TData, TValue> &
        Partial<TConstructors['Column']> & {
          columnDef: ColumnDef<TFeatures, TData, TValue> &
            Partial<TConstructors['ColumnDef']>
        }
    },
) => void

export type ConstructRowAPIs<
  TConstructors extends FeatureConstructors<TData, TValue>,
  TData extends RowData,
  TValue extends CellData = CellData,
> = <TFeatures extends TableFeatures>(
  row: Row<TFeatures, TData> & Partial<TConstructors['Row']>,
) => void

export type ConstructTableAPIs<
  TConstructors extends FeatureConstructors<TData, TValue>,
  TData extends RowData,
  TValue extends CellData = CellData,
> = <TFeatures extends TableFeatures>(
  table: Table_Internal<TFeatures, TData> &
    Partial<TConstructors['Table']> & {
      options: Partial<TConstructors['TableOptions']>
    },
) => void

export type GetDefaultColumnDef<
  TConstructors extends FeatureConstructors<TData, TValue>,
  TData extends RowData,
  TValue extends CellData = CellData,
> = <TFeatures extends TableFeatures>() => ColumnDefBase_All<
  TFeatures,
  TData,
  TValue
> &
  Partial<TConstructors['ColumnDef']>

export type GetDefaultTableOptions<
  TConstructors extends FeatureConstructors<TData, TValue>,
  TData extends RowData,
  TValue extends CellData = CellData,
> = <TFeatures extends TableFeatures>(
  table: Table_Internal<TFeatures, TData> & Partial<TConstructors['Table']>,
) => Partial<TableOptions_All<TFeatures, TData>> &
  Partial<TConstructors['TableOptions']>

export type GetInitialState<
  TConstructors extends FeatureConstructors<TData, TValue>,
  TData extends RowData,
  TValue extends CellData = CellData,
> = (
  initialState: Partial<TableState_All> & Partial<TConstructors['TableState']>,
) => TableState_All & Partial<TConstructors['TableState']>

export interface TableFeature<
  TConstructors extends FeatureConstructors<TData, TValue>,
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  constructCellAPIs?: ConstructCellAPIs<TConstructors, TData, TValue>
  constructColumnAPIs?: ConstructColumnAPIs<TConstructors, TData, TValue>
  constructHeaderAPIs?: ConstructHeaderAPIs<TConstructors, TData, TValue>
  constructRowAPIs?: ConstructRowAPIs<TConstructors, TData, TValue>
  constructTableAPIs?: ConstructTableAPIs<TConstructors, TData, TValue>
  getDefaultColumnDef?: GetDefaultColumnDef<TConstructors, TData, TValue>
  getDefaultTableOptions?: GetDefaultTableOptions<TConstructors, TData, TValue>
  getInitialState?: GetInitialState<TConstructors, TData, TValue>
}
