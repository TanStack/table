import { createTableHook } from '@tanstack/react-table'
import { features } from '@/hooks/features'
import { dynamicFilterFn } from '@/lib/data-table'

import { DataTablePagination } from '@/components/data-table/data-table-pagination'
import { DataTableFilterList } from '@/components/data-table/data-table-filter-list'
import { DataTableSortList } from '@/components/data-table/data-table-sort-list'
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options'

import {
  ActionsCell,
  AgeCell,
  DateCell,
  DepartmentCell,
  GroupedCell,
  ProgressCell,
  SelectCell,
  StatusCell,
  TextCell,
} from '@/components/data-table/cell-components'

import { ColumnHeader } from '@/components/data-table/data-table-column-header'
import {
  ResizeHandle,
  SelectAllHeader,
} from '@/components/data-table/header-components'

export const {
  createAppColumnHelper,
  useAppTable,
  useTableContext,
  useCellContext,
  useHeaderContext,
} = createTableHook({
  features,
  defaultColumn: {
    size: 120,
    minSize: 60,
    maxSize: 800,
    filterFn: dynamicFilterFn,
  },
  globalFilterFn: 'fuzzy',
  getRowId: (row: any) => row.id,
  enableRowSelection: true,
  columnResizeMode: 'onChange' as const,

  tableComponents: {
    Pagination: DataTablePagination,
    FilterList: DataTableFilterList,
    SortList: DataTableSortList,
    ViewOptions: DataTableViewOptions,
  },

  cellComponents: {
    SelectCell,
    TextCell,
    AgeCell,
    StatusCell,
    DepartmentCell,
    DateCell,
    ProgressCell,
    GroupedCell,
    ActionsCell,
  },

  headerComponents: {
    ColumnHeader,
    SelectAllHeader,
    ResizeHandle,
  },
})
