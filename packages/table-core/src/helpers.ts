import type {
  AccessorFn,
  AccessorFnColumnDef,
  AccessorKeyColumnDef,
  DisplayColumnDef,
  GroupColumnDef,
  IdentifiedColumnDef,
  RowData,
  TableOptions,
} from './types'
import type { DeepKeys, DeepValue } from './utils.types'

export type ColumnHelper<TData extends RowData> = {
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
      ? DisplayColumnDef<TData, TValue>
      : IdentifiedColumnDef<TData, TValue>,
  ) => TAccessor extends AccessorFn<TData>
    ? AccessorFnColumnDef<TData, TValue>
    : AccessorKeyColumnDef<TData, TValue>
  display: (column: DisplayColumnDef<TData>) => DisplayColumnDef<TData, unknown>
  group: (column: GroupColumnDef<TData>) => GroupColumnDef<TData, unknown>
}

/**
 * Create a column helper to make it easier to define columns with better TValue type inference
 */
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
    display: (column) => column,
    group: (column) => column,
  }
}

export function tableOptions<TData extends RowData = any>(
  options: Omit<TableOptions<TData>, 'columns'>,
): Omit<TableOptions<TData>, 'columns'>

export function tableOptions<TData extends RowData = any>(
  options: Omit<TableOptions<TData>, 'data'>,
): Omit<TableOptions<TData>, 'data'>

export function tableOptions<TData extends RowData = any>(
  options: Omit<TableOptions<TData>, '_features'>,
): Omit<TableOptions<TData>, '_features'>

export function tableOptions<TData extends RowData = any>(
  options: Omit<TableOptions<TData>, '_rowModels'>,
): Omit<TableOptions<TData>, '_rowModels'>

export function tableOptions<TData extends RowData = any>(
  options: Omit<TableOptions<TData>, 'data' | 'columns'>,
): Omit<TableOptions<TData>, 'data' | 'columns'>

export function tableOptions<TData extends RowData = any>(
  options: Omit<TableOptions<TData>, 'data' | '_features'>,
): Omit<TableOptions<TData>, 'data' | '_features'>

export function tableOptions<TData extends RowData = any>(
  options: Omit<TableOptions<TData>, 'data' | '_rowModels'>,
): Omit<TableOptions<TData>, 'data' | '_rowModels'>

export function tableOptions<TData extends RowData = any>(
  options: Omit<TableOptions<TData>, 'columns' | '_features'>,
): Omit<TableOptions<TData>, 'columns' | '_features'>

export function tableOptions<TData extends RowData = any>(
  options: Omit<TableOptions<TData>, 'columns' | '_rowModels'>,
): Omit<TableOptions<TData>, 'columns' | '_rowModels'>

export function tableOptions<TData extends RowData = any>(
  options: Omit<TableOptions<TData>, '_features' | '_rowModels'>,
): Omit<TableOptions<TData>, '_features' | '_rowModels'>

export function tableOptions<TData extends RowData = any>(
  options: Omit<TableOptions<TData>, 'data' | 'columns' | '_features'>,
): Omit<TableOptions<TData>, 'data' | 'columns' | '_features'>

export function tableOptions<TData extends RowData = any>(
  options: Omit<TableOptions<TData>, 'data' | 'columns' | '_rowModels'>,
): Omit<TableOptions<TData>, 'data' | 'columns' | '_rowModels'>

export function tableOptions<TData extends RowData = any>(
  options: Omit<TableOptions<TData>, 'data' | '_features' | '_rowModels'>,
): Omit<TableOptions<TData>, 'data' | '_features' | '_rowModels'>

export function tableOptions<TData extends RowData = any>(
  options: Omit<TableOptions<TData>, 'columns' | '_features' | '_rowModels'>,
): Omit<TableOptions<TData>, 'columns' | '_features' | '_rowModels'>

export function tableOptions<TData extends RowData = any>(
  options: Omit<
    TableOptions<TData>,
    'data' | 'columns' | '_features' | '_rowModels'
  >,
): Omit<TableOptions<TData>, 'data' | 'columns' | '_features' | '_rowModels'>

export function tableOptions<TData extends RowData = any>(
  options: TableOptions<TData>,
): TableOptions<TData>

export function tableOptions(options: unknown) {
  return options
}

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
