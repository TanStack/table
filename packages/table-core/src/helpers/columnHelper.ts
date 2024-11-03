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
  columns: (
    columns: Array<ColumnDef<TFeatures, TData, any>>,
  ) => Array<ColumnDef<TFeatures, TData, unknown>>
  display: (
    column: DisplayColumnDef<TFeatures, TData>,
  ) => DisplayColumnDef<TFeatures, TData, unknown>
  group: (
    column: GroupColumnDef<TFeatures, TData, unknown>,
  ) => GroupColumnDef<TFeatures, TData, unknown>
}

/**
 * A helper utility for creating column definitions with slightly better type inference for each individual column.
 * The `TValue` generic is inferred based on the accessor key or function provided.
 *
 * **Note:** From a JavaScript perspective, the functions in these helpers do not do anything. They are only used to help TypeScript infer the correct types for the column definitions.
 *
 * @example
 * ```tsx
 * const helper = createColumnHelper<typeof _features, Person>() // _features is the result of `tableFeatures({})` helper
 *
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
    columns: (columns) =>
      columns as Array<ColumnDef<TFeatures, TData, unknown>>,
    display: (column) => column,
    group: (column) => column,
  }
}

// test

// type Person = {
//   firstName: string
//   lastName: string
//   age: number
//   visits: number
//   status: string
//   progress: number
//   createdAt: Date
//   nested: {
//     foo: [
//       {
//         bar: 'bar'
//       },
//     ]
//     bar: Array<{ subBar: boolean }>
//     baz: {
//       foo: 'foo'
//       bar: {
//         baz: 'baz'
//       }
//     }
//   }
// }

// const test: DeepKeys<Person> = 'nested.foo.0.bar'
// const test2: DeepKeys<Person> = 'nested.bar'

// const helper = createColumnHelper<{}, Person>()

// helper.accessor('nested.foo', {
//   cell: (info) => info.getValue(),
// })

// helper.accessor('nested.foo.0.bar', {
//   cell: (info) => info.getValue(),
// })

// helper.accessor('nested.bar', {
//   cell: (info) => info.getValue(),
// })

// helper.group({
//   id: 'hello',
//   columns: [
//     helper.accessor('firstName', {}),
//     helper.accessor((row) => row.lastName, {
//       id: 'lastName',
//     }),
//     helper.accessor('age', {}),
//   ] as Array<ColumnDef<{}, Person>>,
// })
