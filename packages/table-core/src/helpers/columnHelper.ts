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

  columns: <TFeatures extends TableFeatures, TData extends RowData>(
    columns:
      | Array<ColumnDef<TFeatures, TData, any>>
      | DisplayColumnDef<TFeatures, TData, any>
      | GroupColumnDef<TFeatures, TData, any>,
  ) => Array<ColumnDef<TFeatures, TData, unknown>>

  display: (
    column: DisplayColumnDef<TFeatures, TData, any>,
  ) => DisplayColumnDef<TFeatures, TData>

  group: (
    column: GroupColumnDef<TFeatures, TData>,
  ) => GroupColumnDef<TFeatures, TData>
}

/**
 * Create a column helper to make it easier to define columns with better TValue type inference
 */
export function createColumnHelper<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): ColumnHelper<TFeatures, TData> {
  return {
    accessor: (accessor, accessorColumnDef) => {
      return typeof accessor === 'function'
        ? ({
            ...accessorColumnDef,
            accessorFn: accessor,
          } as any)
        : {
            ...accessorColumnDef,
            accessorKey: accessor,
          }
    },
    columns: (columnDefs) => columnDefs as any,
    display: (displayColumnDef) => displayColumnDef,
    group: (groupColumnDef) => groupColumnDef,
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

// const helper = createColumnHelper<any, Person>()

// helper.accessor('nested.foo', {
//   cell: (info) => info.getValue(),
// })

// helper.accessor('nested.foo.0.bar', {
//   cell: (info) => info.getValue(),
// })

// helper.accessor('nested.bar', {
//   cell: (info) => info.getValue(),
// })

// helper.columns([
//   helper.accessor('firstName', { cell: (info) => info.getValue() }),
//   helper.accessor('lastName', { cell: (info) => info.getValue() }),
//   helper.accessor('age', { cell: (info) => info.getValue() }),
//   helper.display({ header: 'Visits', id: 'visits' }),
// ])
