import type {
  Cell,
  CellData,
  Header,
  RowData,
  TableFeatures,
} from '@tanstack/table-core'

export function flexRender<TProps>(
  Comp: ((props: TProps) => unknown) | string | undefined | null,
  props: TProps,
): unknown {
  if (Comp == null) return ''
  if (typeof Comp === 'function') return Comp(props)
  return Comp
}

export function flexRenderCell<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(cell: Cell<TFeatures, TData, TValue>): unknown {
  return flexRender(
    cell.column.columnDef.cell as
      | ((props: unknown) => unknown)
      | string
      | undefined,
    cell.getContext(),
  )
}

export function flexRenderHeader<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(header: Header<TFeatures, TData, TValue>): unknown {
  if (header.isPlaceholder) return ''
  return flexRender(
    header.column.columnDef.header as
      | ((props: unknown) => unknown)
      | string
      | undefined,
    header.getContext(),
  )
}

export function flexRenderFooter<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(header: Header<TFeatures, TData, TValue>): unknown {
  if (header.isPlaceholder) return ''
  return flexRender(
    header.column.columnDef.footer as
      | ((props: unknown) => unknown)
      | string
      | undefined,
    header.getContext(),
  )
}
