import type { CellData, RowData, UnionToIntersection } from './type-utils'
import type { TableFeatures } from './TableFeatures'
import type { CellContext } from '../core/cells/Cells.types'
import type { HeaderContext } from '../core/headers/Headers.types'
import type {
  ColumnDef_ColumnFiltering,
  ColumnDef_ColumnFiltering_Unavailable,
} from '../features/column-filtering/ColumnFiltering.types'
import type {
  ColumnDef_ColumnGrouping,
  ColumnDef_ColumnGrouping_Unavailable,
} from '../features/column-grouping/ColumnGrouping.types'
import type {
  ColumnDef_ColumnPinning,
  ColumnDef_ColumnPinning_Unavailable,
} from '../features/column-pinning/ColumnPinning.types'
import type {
  ColumnDef_ColumnResizing,
  ColumnDef_ColumnResizing_Unavailable,
} from '../features/column-resizing/ColumnResizing.types'
import type { ColumnDef_ColumnSizing } from '../features/column-sizing/ColumnSizing.types'
import type {
  ColumnDef_ColumnVisibility,
  ColumnDef_ColumnVisibility_Unavailable,
} from '../features/column-visibility/ColumnVisibility.types'
import type {
  ColumnDef_GlobalFiltering,
  ColumnDef_GlobalFiltering_Unavailable,
} from '../features/global-filtering/GlobalFiltering.types'
import type {
  ColumnDef_RowSorting,
  ColumnDef_RowSorting_Unavailable,
} from '../features/row-sorting/RowSorting.types'

export interface ColumnMeta<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> {}

export type AccessorFn<
  TData extends RowData,
  TValue extends CellData = CellData,
> = (originalRow: TData, index: number) => TValue

export type ColumnDefTemplate<TProps extends object> =
  | string
  | ((props: TProps) => any)

export type StringOrTemplateHeader<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = string | ColumnDefTemplate<HeaderContext<TFeatures, TData, TValue>>

export interface StringHeaderIdentifier {
  header: string
  id?: string
}

export interface IdIdentifier<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  id: string
  header?: StringOrTemplateHeader<TFeatures, TData, TValue>
}
type ColumnIdentifiers<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = IdIdentifier<TFeatures, TData, TValue> | StringHeaderIdentifier

interface ColumnDefBase_Core<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  getUniqueValues?: AccessorFn<TData, Array<unknown>>
  footer?: ColumnDefTemplate<HeaderContext<TFeatures, TData, TValue>>
  cell?: ColumnDefTemplate<CellContext<TFeatures, TData, TValue>>
  meta?: ColumnMeta<TFeatures, TData, TValue>
}

export type ColumnDefBase<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = ColumnDefBase_Core<TFeatures, TData, TValue> &
  UnionToIntersection<
    | ('ColumnVisibility' extends keyof TFeatures
        ? ColumnDef_ColumnVisibility
        : never)
    | ('ColumnPinning' extends keyof TFeatures
        ? ColumnDef_ColumnPinning
        : never)
    | ('ColumnFiltering' extends keyof TFeatures
        ? ColumnDef_ColumnFiltering<TFeatures, TData>
        : never)
    | ('GlobalFiltering' extends keyof TFeatures
        ? ColumnDef_GlobalFiltering
        : never)
    | ('RowSorting' extends keyof TFeatures
        ? ColumnDef_RowSorting<TFeatures, TData>
        : never)
    | ('ColumnGrouping' extends keyof TFeatures
        ? ColumnDef_ColumnGrouping<TFeatures, TData, TValue>
        : never)
    | ('ColumnSizing' extends keyof TFeatures ? ColumnDef_ColumnSizing : never)
    | ('ColumnResizing' extends keyof TFeatures
        ? ColumnDef_ColumnResizing
        : never)
  >

// export type ColumnDefBase<
//   TFeatures extends TableFeatures,
//   TData extends RowData,
//   TValue extends CellData = CellData,
// > = ColumnDefBase_Core<TFeatures, TData, TValue> &
//   ('ColumnVisibility' extends keyof TFeatures
//     ? ColumnDef_ColumnVisibility
//     : ColumnDef_ColumnVisibility_Unavailable) &
//   ('ColumnPinning' extends keyof TFeatures
//     ? ColumnDef_ColumnPinning
//     : ColumnDef_ColumnPinning_Unavailable) &
//   ('ColumnFiltering' extends keyof TFeatures
//     ? ColumnDef_ColumnFiltering<TFeatures, TData>
//     : ColumnDef_ColumnFiltering_Unavailable<TFeatures, TData>) &
//   ('GlobalFiltering' extends keyof TFeatures
//     ? ColumnDef_GlobalFiltering
//     : ColumnDef_GlobalFiltering_Unavailable) &
//   ('RowSorting' extends keyof TFeatures
//     ? ColumnDef_RowSorting<TFeatures, TData>
//     : ColumnDef_RowSorting_Unavailable<TFeatures, TData>) &
//   ('ColumnGrouping' extends keyof TFeatures
//     ? ColumnDef_ColumnGrouping<TFeatures, TData, TValue>
//     : ColumnDef_ColumnGrouping_Unavailable<TFeatures, TData, TValue>) &
//   ('ColumnSizing' extends keyof TFeatures ? ColumnDef_ColumnSizing : {}) &
//   ('ColumnResizing' extends keyof TFeatures
//     ? ColumnDef_ColumnResizing
//     : ColumnDef_ColumnResizing_Unavailable)

export type ColumnDefBase_All<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = ColumnDefBase_Core<TFeatures, TData, TValue> &
  Partial<
    ColumnDef_ColumnVisibility &
      ColumnDef_ColumnPinning &
      ColumnDef_ColumnFiltering<TFeatures, TData> &
      ColumnDef_GlobalFiltering &
      ColumnDef_RowSorting<TFeatures, TData> &
      ColumnDef_ColumnGrouping<TFeatures, TData, TValue> &
      ColumnDef_ColumnSizing &
      ColumnDef_ColumnResizing
  >

export type IdentifiedColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = ColumnDefBase<TFeatures, TData, TValue> & {
  id?: string
  header?: StringOrTemplateHeader<TFeatures, TData, TValue>
}

export type DisplayColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = ColumnDefBase<TFeatures, TData, TValue> &
  ColumnIdentifiers<TFeatures, TData, TValue>
type GroupColumnDefBase<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = ColumnDefBase<TFeatures, TData, TValue> & {
  columns?: Array<ColumnDef<TFeatures, TData, unknown>>
}

export type GroupColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = GroupColumnDefBase<TFeatures, TData, TValue> &
  ColumnIdentifiers<TFeatures, TData, TValue>

export type AccessorFnColumnDefBase<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = ColumnDefBase<TFeatures, TData, TValue> & {
  accessorFn: AccessorFn<TData, TValue>
}

export type AccessorFnColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = AccessorFnColumnDefBase<TFeatures, TData, TValue> &
  ColumnIdentifiers<TFeatures, TData, TValue>

export type AccessorKeyColumnDefBase<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = ColumnDefBase<TFeatures, TData, TValue> & {
  id?: string
  accessorKey: (string & {}) | keyof TData
}

export type AccessorKeyColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = AccessorKeyColumnDefBase<TFeatures, TData, TValue> &
  Partial<ColumnIdentifiers<TFeatures, TData, TValue>>

export type AccessorColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> =
  | AccessorKeyColumnDef<TFeatures, TData, TValue>
  | AccessorFnColumnDef<TFeatures, TData, TValue>

export type ColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> =
  | DisplayColumnDef<TFeatures, TData, TValue>
  | GroupColumnDef<TFeatures, TData, TValue>
  | AccessorColumnDef<TFeatures, TData, TValue>

export type ColumnDefResolved<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = Partial<UnionToIntersection<ColumnDef<TFeatures, TData, TValue>>> & {
  accessorKey?: string
}
