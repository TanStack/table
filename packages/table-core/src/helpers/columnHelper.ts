import type { DeepKeys, DeepValue, RowData } from '../types/type-utils'
import type { TableFeatures } from '../types/TableFeatures'
import type {
  AccessorFn,
  AccessorFnColumnDef,
  AccessorKeyColumnDef,
  ColumnDef,
  DisplayColumnDef,
  GroupColumnDef,
  IdentifiedColumnDef,
} from '../types/ColumnDef'

export type ColumnHelper<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = {
  /**
   * Creates a data column definition with an accessor key or function to extract the cell value.
   * @example
   * ```ts
   * helper.accessor('firstName', { cell: (info) => info.getValue() })
   * helper.accessor((row) => row.lastName, { id: 'lastName' })
   * ```
   */
  accessor: <
    TAccessor extends AccessorFn<TData> | DeepKeys<TData>,
    TValue extends TAccessor extends AccessorFn<TData, infer TReturn>
      ? TReturn
      : TAccessor extends DeepKeys<TData>
        ? DeepValue<TData, TAccessor>
        : never,
  >(
    accessor: TAccessor,
    column: TAccessor extends AccessorFn<TData>
      ? DisplayColumnDef<TFeatures, TData, TValue>
      : IdentifiedColumnDef<TFeatures, TData, TValue>,
  ) => TAccessor extends AccessorFn<TData>
    ? AccessorFnColumnDef<TFeatures, TData, TValue>
    : AccessorKeyColumnDef<TFeatures, TData, TValue>
  /**
   * Wraps an array of column definitions to preserve each column's individual TValue type.
   * Uses variadic tuple types to infer element types before checking constraints, preventing type widening.
   * @example
   * ```ts
   * helper.columns([helper.accessor('firstName', {}), helper.accessor('age', {})])
   * ```
   */
  columns: <TColumns extends ReadonlyArray<ColumnDef<TFeatures, TData, any>>>(
    columns: [...TColumns],
  ) => Array<ColumnDef<TFeatures, TData, any>> & [...TColumns]
  /**
   * Creates a display column definition for non-data columns like actions or row selection.
   * @example
   * ```ts
   * helper.display({ id: 'actions', header: 'Actions', cell: () => <button>Edit</button> })
   * ```
   */
  display: (
    column: DisplayColumnDef<TFeatures, TData>,
  ) => DisplayColumnDef<TFeatures, TData, unknown>
  /**
   * Creates a group column definition that contains nested child columns.
   * @example
   * ```ts
   * helper.group({
   *   id: 'name',
   *   header: 'Name',
   *   columns: helper.columns([
   *     helper.accessor('firstName', {}),
   *     helper.accessor('lastName', { id: 'lastName' }),
   *   ]),
   * })
   * ```
   */
  group: (
    column: GroupColumnDef<TFeatures, TData, unknown>,
  ) => GroupColumnDef<TFeatures, TData, unknown>
}

/**
 * A helper utility for creating column definitions with slightly better type inference for each individual column.
 * The `TValue` generic is inferred based on the accessor key or function provided.
 * **Note:** From a JavaScript perspective, the functions in these helpers do not do anything. They are only used to help TypeScript infer the correct types for the column definitions.
 * @example
 * ```tsx
 * const helper = createColumnHelper<typeof _features, Person>() // _features is the result of `tableFeatures({})` helper
 * const columns = [
 *  helper.display({ id: 'actions', header: 'Actions' }),
 *  helper.accessor('firstName', {}),
 *  helper.accessor((row) => row.lastName, {}
 * ]
 * ```
 */
export function createColumnHelper<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): ColumnHelper<TFeatures, TData> {
  return {
    accessor: (accessor, column) => {
      return typeof accessor === 'function'
        ? ({
            ...column,
            accessorFn: accessor,
          } as any)
        : {
            ...column,
            accessorKey: accessor,
          }
    },
    columns: <TColumns extends ReadonlyArray<ColumnDef<TFeatures, TData, any>>>(
      columns: [...TColumns],
    ): Array<ColumnDef<TFeatures, TData, any>> & [...TColumns] =>
      columns as Array<ColumnDef<TFeatures, TData, any>> & [...TColumns],
    display: (column) => column,
    group: (column) => column,
  }
}
