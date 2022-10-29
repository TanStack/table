import {
  AccessorColumnDef,
  AccessorFn,
  DisplayColumnDef,
  GroupColumnDef,
  IdentifiedColumnDef,
  RowData,
} from './types'
import { DeepValue } from './utils'

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

type AccessorType<TData, TAccessor> = TAccessor extends AccessorFn<
  TData,
  infer TReturn
>
  ? TReturn
  : DeepValue<TData, TAccessor>

type Accessor<TData extends RowData> = <
  TAccessor extends AccessorFn<TData> | string,
  TValue extends AccessorType<TData, TAccessor>
>(
  accessor: TAccessor,
  column: TAccessor extends AccessorFn<TData>
    ? DisplayColumnDef<TData, TValue>
    : IdentifiedColumnDef<TData, TValue>
) => TValue extends never
  ? never
  : AccessorColumnDef<TData, AccessorType<TData, TAccessor>>

export interface ColumnHelper<TData extends RowData> {
  accessor: Accessor<TData>
  display: (column: DisplayColumnDef<TData>) => DisplayColumnDef<TData>
  group: (column: GroupColumnDef<TData>) => GroupColumnDef<TData>
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
    display: column => column as DisplayColumnDef<TData>,
    group: column => column as GroupColumnDef<TData>,
  }
}
