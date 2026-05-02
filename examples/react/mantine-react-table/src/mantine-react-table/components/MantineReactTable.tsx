import { useMantineReactTable } from '../hooks/useMantineReactTable'
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

type Props<TData extends MRT_RowData> = Xor<
  TableInstanceProp<TData>,
  MRT_TableOptions<TData>
>

const isTableInstanceProp = <TData extends MRT_RowData>(
  props: Props<TData>,
): props is TableInstanceProp<TData> =>
  (props as TableInstanceProp<TData>).table !== undefined

export const MantineReactTable = <TData extends MRT_RowData>(
  props: Props<TData>,
) => {
  let table: MRT_TableInstance<TData>

  if (isTableInstanceProp(props)) {
    table = props.table
  } else {
    table = useMantineReactTable(props)
  }

  return <MRT_TablePaper table={table} />
}
