import { useMemo } from 'react'
import type {
  DropdownOption,
  MRT_Column,
  MRT_ColumnDef,
  MRT_ColumnOrderState,
  MRT_DefinedColumnDef,
  MRT_DefinedTableOptions,
  MRT_FilterOption,
  MRT_Header,
  MRT_RowData,
  MRT_TableInstance,
} from '../types'

// `MRT_ColumnDef` is now the core `ColumnDef` union, so accessor-key / group /
// MRT-specific fields live on individual union members. This resolution code
// reads and mutates them freely, so it operates on a loose view via `any`.
export const getColumnId = <TData extends MRT_RowData>(
  columnDef: MRT_ColumnDef<TData>,
): string => {
  const def = columnDef as any
  return def.id ?? def.accessorKey?.toString?.() ?? def.header
}

export const getAllLeafColumnDefs = <TData extends MRT_RowData>(
  columns: Array<MRT_ColumnDef<TData>>,
): Array<MRT_ColumnDef<TData>> => {
  const allLeafColumnDefs: Array<MRT_ColumnDef<TData>> = []
  const getLeafColumns = (cols: Array<MRT_ColumnDef<TData>>) => {
    cols.forEach((col) => {
      const subCols = (col as any).columns as
        | Array<MRT_ColumnDef<TData>>
        | undefined
      if (subCols) {
        getLeafColumns(subCols)
      } else {
        allLeafColumnDefs.push(col)
      }
    })
  }
  getLeafColumns(columns)
  return allLeafColumnDefs
}

export const prepareColumns = <TData extends MRT_RowData>({
  columnDefs,
  tableOptions,
}: {
  columnDefs: Array<MRT_ColumnDef<TData>>
  tableOptions: MRT_DefinedTableOptions<TData>
}): Array<MRT_DefinedColumnDef<TData>> => {
  // `filterFns` / `sortFns` are carried on the options object
  // at runtime (client-supplied custom fns), but aren't declared as core options
  // (they're feature-slot registries), so read them off a loose view.
  const {
    defaultDisplayColumn,
    filterFns = {},
    sortFns = {},
    state: { columnFilterFns = {} } = {},
  } = tableOptions as any
  return columnDefs.map((columnDef) => {
    const def = columnDef as any
    // assign columnId
    if (!def.id) def.id = getColumnId(columnDef)
    // assign columnDefType
    if (!def.columnDefType) def.columnDefType = 'data'
    if (def.columns?.length) {
      def.columnDefType = 'group'
      // recursively prepare columns if this is a group column
      def.columns = prepareColumns({
        columnDefs: def.columns,
        tableOptions,
      })
    } else if (def.columnDefType === 'data') {
      // assign filterFns
      if (Object.keys(filterFns).includes(columnFilterFns[def.id])) {
        def.filterFn = filterFns[columnFilterFns[def.id]] ?? filterFns.fuzzy
        def._filterFn = columnFilterFns[def.id]
      }

      // assign sortFns
      if (Object.keys(sortFns).includes(def.sortFn as string)) {
        def.sortFn = sortFns[def.sortFn as string]
      }
    } else if (def.columnDefType === 'display') {
      columnDef = {
        ...(defaultDisplayColumn as MRT_ColumnDef<TData>),
        ...columnDef,
      }
    }
    return columnDef
  }) as Array<MRT_DefinedColumnDef<TData>>
}

export const reorderColumn = <TData extends MRT_RowData>(
  draggedColumn: MRT_Column<TData>,
  targetColumn: MRT_Column<TData>,
  columnOrder: MRT_ColumnOrderState,
): MRT_ColumnOrderState => {
  if (draggedColumn.getCanPin()) {
    draggedColumn.pin(targetColumn.getIsPinned())
  }
  const newColumnOrder = [...columnOrder]
  newColumnOrder.splice(
    newColumnOrder.indexOf(targetColumn.id),
    0,
    newColumnOrder.splice(newColumnOrder.indexOf(draggedColumn.id), 1)[0],
  )
  return newColumnOrder
}

export const getDefaultColumnFilterFn = <TData extends MRT_RowData>(
  columnDef: MRT_ColumnDef<TData>,
): MRT_FilterOption => {
  const { filterVariant } = columnDef
  if (filterVariant === 'multi-select') return 'arrIncludesSome'
  if (filterVariant?.includes('range')) return 'betweenInclusive'
  if (filterVariant === 'select' || filterVariant === 'checkbox')
    return 'equals'
  return 'fuzzy'
}

export const getColumnFilterInfo = <TData extends MRT_RowData>({
  header,
  table,
}: {
  header: MRT_Header<TData>
  table: MRT_TableInstance<TData>
}) => {
  const {
    options: { columnFilterModeOptions },
  } = table
  const { column } = header
  const { columnDef } = column
  const { filterVariant } = columnDef

  const isDateFilter = !!(
    filterVariant?.startsWith('date') || filterVariant?.startsWith('time')
  )
  const isAutocompleteFilter = filterVariant === 'autocomplete'
  const isRangeFilter =
    filterVariant?.includes('range') ||
    ['between', 'betweenInclusive', 'inNumberRange'].includes(
      columnDef._filterFn!,
    )
  const isSelectFilter = filterVariant === 'select'
  const isMultiSelectFilter = filterVariant === 'multi-select'
  const isTextboxFilter =
    ['autocomplete', 'text'].includes(filterVariant!) ||
    (!isSelectFilter && !isMultiSelectFilter)
  const currentFilterOption = columnDef._filterFn

  const allowedColumnFilterOptions =
    columnDef?.columnFilterModeOptions ?? columnFilterModeOptions

  const facetedUniqueValues = column.getFacetedUniqueValues()

  return {
    allowedColumnFilterOptions,
    currentFilterOption,
    facetedUniqueValues,
    isAutocompleteFilter,
    isDateFilter,
    isMultiSelectFilter,
    isRangeFilter,
    isSelectFilter,
    isTextboxFilter,
  } as const
}

export const useDropdownOptions = <TData extends MRT_RowData>({
  header,
  table,
}: {
  header: MRT_Header<TData>
  table: MRT_TableInstance<TData>
}): Array<DropdownOption> | undefined => {
  const { column } = header
  const { columnDef } = column
  const {
    facetedUniqueValues,
    isAutocompleteFilter,
    isMultiSelectFilter,
    isSelectFilter,
  } = getColumnFilterInfo({ header, table })

  return useMemo<Array<DropdownOption> | undefined>(
    () =>
      columnDef.filterSelectOptions ??
      ((isSelectFilter || isMultiSelectFilter || isAutocompleteFilter) &&
      facetedUniqueValues
        ? Array.from(facetedUniqueValues.keys())
            .filter((value) => value !== null && value !== undefined)
            .sort((a, b) => a.localeCompare(b))
        : undefined),
    [
      columnDef.filterSelectOptions,
      facetedUniqueValues,
      isMultiSelectFilter,
      isSelectFilter,
    ],
  )
}
