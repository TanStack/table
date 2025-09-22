import {
  AccessorFn,
  AccessorFnColumnDef,
  AccessorKeyColumnDef,
  DisplayColumnDef,
  GroupColumnDef,
  IdentifiedColumnDef,
  RowData,
} from './types'
import { DeepKeys, DeepValue } from './utils'

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

type AccessorValue<
  TData,
  TAccessor extends AccessorFn<TData> | DeepKeys<TData>,
> =
  TAccessor extends AccessorFn<TData, infer TReturn>
    ? TReturn
    : TAccessor extends DeepKeys<TData>
      ? DeepValue<TData, TAccessor>
      : never

export type ColumnHelper<TData extends RowData> = {
  accessor: <TAccessor extends AccessorFn<TData> | DeepKeys<TData>>(
    accessor: TAccessor,
    column: TAccessor extends AccessorFn<TData>
      ? DisplayColumnDef<TData, AccessorValue<TData, TAccessor>>
      : IdentifiedColumnDef<TData, AccessorValue<TData, TAccessor>>
  ) => TAccessor extends AccessorFn<TData>
    ? AccessorFnColumnDef<TData, AccessorValue<TData, TAccessor>>
    : AccessorKeyColumnDef<TData, AccessorValue<TData, TAccessor>>
  display: (column: DisplayColumnDef<TData>) => DisplayColumnDef<TData, unknown>
  group: (column: GroupColumnDef<TData>) => GroupColumnDef<TData, unknown>
}

export function createColumnHelper<
  TData extends RowData,
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
    display: column => column,
    group: column => column,
  }
}
