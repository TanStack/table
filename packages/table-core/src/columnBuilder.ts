// import { ColumnDef, AccessorFn, TableGenerics } from './types'
// import { Overwrite } from './utils'

// export type ColumnBuilder<TData extends RowData> = {
//   createGroup: (
//     column: Overwrite<
//       | Overwrite<
//           ColumnDef<any>,
//           {
//             header: string
//             id?: string
//           }
//         >
//       | Overwrite<
//           ColumnDef<any>,
//           {
//             id: string
//             header?: string | ((...any: any) => any)
//           }
//         >,
//       {
//         accessorFn?: never
//         accessorKey?: never
//         columns?: ColumnDef<any>[]
//       }
//     >
//   ) => ColumnDef<TData, TValue>
//   createDisplayColumn: (
//     column: Omit<ColumnDef<TData, TValue>, 'columns'>
//   ) => ColumnDef<TData, TValue>
//   createDataColumn: <
//     TAccessor extends AccessorFn<TData> | keyof TData
//   >(
//     accessor: TAccessor,
//     column: Overwrite<
//       TAccessor extends (...args: any[]) => any
//         ? // Accessor Fn
//           ColumnDef<Overwrite<TGenerics, { Value: ReturnType<TAccessor> }>>
//         : TAccessor extends keyof TData
//         ? // Accessor Key
//           Overwrite<
//             ColumnDef<
//               Overwrite<TGenerics, { Value: TData[TAccessor] }>
//             >,
//             {
//               id?: string
//             }
//           >
//         : never,
//       {
//         accessorFn?: never
//         accessorKey?: never
//         columns?: ColumnDef<any>[]
//       }
//     >
//   ) => ColumnDef<TData, TValue>
// }

// // A lot of returns in here are `as any` for a reason. Unless you
// // can find a better way to do this, then don't worry about them
// export function createColumnBuilder<
//   TData extends RowData
// >(): ColumnBuilder<TData> {
//   return {
//     createDisplayColumn: column => ({ ...column, columnDefType: 'display' }),
//     createGroup: column => ({ ...column, columnDefType: 'group' } as any),
//     createDataColumn: (accessor, column): any => {
//       column = {
//         ...column,
//         columnDefType: 'data',
//         id: column.id,
//       }

//       if (typeof accessor === 'string') {
//         return {
//           ...column,
//           id: column.id ?? accessor,
//           accessorKey: accessor,
//         }
//       }

//       if (typeof accessor === 'function') {
//         return {
//           ...column,
//           accessorFn: accessor,
//         }
//       }

//       throw new Error('Invalid accessor')
//     },
//   }
// }
