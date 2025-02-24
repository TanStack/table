import type { ColumnFilter } from '@tanstack/react-table'

export interface ExtendedColumnFilter extends ColumnFilter {
  operator?: string
  rowId?: string
}
