import { AccessorFn, ColumnDef, RowData } from './types'
import { DeepKeys, DeepValue, RequiredKeys } from './utils'

// type Person = {
//   firstName: string
//   lastName: string
//   age: number
//   visits: number
//   status: string
//   progress: number
//   nested: {
//     foo: [
//       {
//         bar: 'bar'
//       }
//     ]
//     bar: { subBar: boolean }[]
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

// const helper = createColumnHelper<Person>()

// helper.accessor('nested.foo', {
//   cell: info => info.getValue(),
// })

// helper.accessor('nested.foo.0.bar', {
//   cell: info => info.getValue(),
// })

// helper.accessor('nested.bar', {
//   cell: info => info.getValue(),
// })

export type ColumnHelper<TData extends RowData> = {
  accessor: <
    TAccessor extends AccessorFn<TData> | DeepKeys<TData>,
    TValue extends TAccessor extends AccessorFn<TData, infer TReturn>
      ? TReturn
      : TAccessor extends DeepKeys<TData>
      ? DeepValue<TData, TAccessor>
      : never
  >(
    accessor: TAccessor,
    column: Omit<ColumnDef<TData, TValue>, 'accessorKey'>
  ) => ColumnDef<TData, TValue>
  display: (
    column: RequiredKeys<
      Omit<ColumnDef<TData, unknown>, 'accessorKey' | 'accessorFn'>,
      'id'
    >
  ) => ColumnDef<TData, unknown>
  group: (
    column: RequiredKeys<
      Omit<ColumnDef<TData, unknown>, 'accessorKey' | 'accessorFn'>,
      'id' | 'columns'
    >
  ) => ColumnDef<TData, unknown>
}

export function createColumnHelper<
  TData extends RowData
>(): ColumnHelper<TData> {
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
    display: column => column as ColumnDef<TData, unknown>,
    group: column => column as ColumnDef<TData, unknown>,
  }
}
