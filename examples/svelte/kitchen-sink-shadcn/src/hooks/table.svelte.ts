import { createTableHook } from '@tanstack/svelte-table'
import { features } from '@/hooks/features'
import { dynamicFilterFn } from '@/lib/data-table'

import DataTablePagination from '@/components/data-table/DataTablePagination.svelte'
import DataTableFilterList from '@/components/data-table/DataTableFilterList.svelte'
import DataTableSortList from '@/components/data-table/DataTableSortList.svelte'
import DataTableViewOptions from '@/components/data-table/DataTableViewOptions.svelte'

import ActionsCell from '@/components/data-table/ActionsCell.svelte'
import AgeCell from '@/components/data-table/AgeCell.svelte'
import DateCell from '@/components/data-table/DateCell.svelte'
import DepartmentCell from '@/components/data-table/DepartmentCell.svelte'
import GroupedCell from '@/components/data-table/GroupedCell.svelte'
import SelectCell from '@/components/data-table/SelectCell.svelte'
import StatusCell from '@/components/data-table/StatusCell.svelte'
import TextCell from '@/components/data-table/TextCell.svelte'

import ColumnHeader from '@/components/data-table/ColumnHeader.svelte'
import ResizeHandle from '@/components/data-table/ResizeHandle.svelte'
import SelectAllHeader from '@/components/data-table/SelectAllHeader.svelte'

export const {
  createAppColumnHelper,
  createAppTable,
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
    GroupedCell,
    ActionsCell,
  },

  headerComponents: {
    ColumnHeader,
    SelectAllHeader,
    ResizeHandle,
  },
})
