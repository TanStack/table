import { useMaterialReactTable } from '../hooks/useMaterialReactTable'
import { MRT_TablePaper } from './table/MRT_TablePaper'
import type {
  MRT_RowData,
  MRT_TableInstance,
  MRT_TableOptions,
  Xor,
} from '../types'

type TableInstanceProp<TData extends MRT_RowData> = {
  table: MRT_TableInstance<TData>
}

export type MaterialReactTableProps<TData extends MRT_RowData> = Xor<
  TableInstanceProp<TData>,
  MRT_TableOptions<TData>
>

const isTableInstanceProp = <TData extends MRT_RowData>(
  props: MaterialReactTableProps<TData>,
): props is TableInstanceProp<TData> =>
  (props as TableInstanceProp<TData>).table !== undefined

export const MaterialReactTable = <TData extends MRT_RowData>(
  props: MaterialReactTableProps<TData>,
) => {
  let table: MRT_TableInstance<TData>

  if (isTableInstanceProp(props)) {
    table = props.table
  } else {
    table = useMaterialReactTable(props)
  }

  // `AppTable` (attached by `useAppTable`) provides the table via React context
  // so MRT components can read it with `useTableContext()` instead of a prop.
  const AppTable = (table as any).AppTable as React.FC<{
    children: React.ReactNode
  }>

  return (
    <AppTable>
      <MRT_TablePaper />
    </AppTable>
  )
}
