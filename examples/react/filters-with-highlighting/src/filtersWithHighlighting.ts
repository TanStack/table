import { CellContext, FilterFn } from '@tanstack/react-table'

export type HighlightRange = [number, number]
export const HIGHLIGHT_RANGE_START = 0
export const HIGHLIGHT_RANGE_END = 1

declare module '@tanstack/table-core' {
  interface FilterMeta {
    globalFilterRanges?: HighlightRange[]
    columnFilterRanges?: HighlightRange[]
  }
}

export interface ColumnFilterWithHighlightingConfig {
  /** Highlight all or first only */
  highlightAll: boolean
  /** Ignore newlines so newline character in cell value will not be treated as space */
  ignoreNewlines: boolean
  /** Search term */
  term: string
}

interface ResolvedColumnFilterWithHighlightingConfig
  extends ColumnFilterWithHighlightingConfig {
  /** Resolved search term */
  resolvedTerm: string
}

export interface GlobalFilterWithHighlightingConfig {
  /** Highlight all or first only */
  highlightAll: boolean
  /** Ignore newlines so newline character in cell value will not be treated as space */
  ignoreNewlines: boolean
  /** Row must include all space-separated search terms or must include whole search term with spaces */
  multiterm: boolean
  /** Search term */
  term: string
}

interface ResolvedGlobalFilterWithHighlightingConfig
  extends GlobalFilterWithHighlightingConfig {
  /** Resolved search terms */
  resolvedTerms: string[]
}

function find(value: string, term: string, all: boolean = false) {
  const ranges: HighlightRange[] = []
  let position = 0
  while (true) {
    const startIndex = value.indexOf(term, position)
    if (startIndex >= 0) {
      ranges.push([startIndex, startIndex + term.length])
      if (all) {
        position = startIndex + term.length
      } else {
        break
      }
    } else {
      break
    }
  }
  return ranges
}

export const globalFilterWithHighlighting: FilterFn<any> = function (
  row,
  columnId,
  filterValue,
  addMeta
) {
  const allCells = row.getAllCells()
  const firstColumnId = allCells.find(cell => cell.column.getCanGlobalFilter())
    ?.column.id
  // Perform global filtering only when columnId=firstColumnId
  if (columnId !== firstColumnId) return false
  const filterConfig = filterValue as ResolvedGlobalFilterWithHighlightingConfig
  const allCols = allCells
    .filter(cell => cell.column.getCanGlobalFilter())
    .map(cell => cell.column.id)
  const filterTerms = filterConfig.resolvedTerms
  const filterTermsFound = new Array(filterTerms.length).fill(false)
  for (const colId of allCols) {
    const value = row.getValue(colId)
    let valueStr: string
    if (typeof value === 'string') {
      valueStr = value.toLowerCase()
      if (!filterConfig.ignoreNewlines)
        // Replace all newlines with spaces
        // IMPORTANT number of characters must not be changed by replace here
        valueStr = valueStr.replace(/\n/g, ' ')
    } else {
      continue
    }
    // Hacky way to change filter meta for different columns
    row.columnFiltersMeta[colId] = {
      ...row.columnFiltersMeta[colId],
      globalFilterRanges: filterTerms
        .map((term, index) => {
          if (!filterConfig.highlightAll && filterTermsFound[index]) return []
          const ranges = find(valueStr, term, filterConfig.highlightAll)
          if (ranges.length) filterTermsFound[index] = true
          return ranges
        })
        .flat(),
    }
  }
  // Row is passing filter only when all filter terms found in this row
  return filterTermsFound.every(found => found)
}

globalFilterWithHighlighting.resolveFilterValue = function (
  filterValue: GlobalFilterWithHighlightingConfig
): ResolvedGlobalFilterWithHighlightingConfig {
  if (filterValue.multiterm) {
    const filter = filterValue.term
      .split(/\s+/)
      .filter(term => !!term)
      .map(term => term.toLowerCase())
    if (filter.length === 0) throw new Error('Filter cannot be empty')
    return { ...filterValue, resolvedTerms: filter }
  }
  return { ...filterValue, resolvedTerms: [filterValue.term.toLowerCase()] }
}

export const columnFilterWithHighlighting: FilterFn<any> = function (
  row,
  columnId,
  filterValue,
  addMeta
) {
  const filterConfig = filterValue as ResolvedColumnFilterWithHighlightingConfig
  const term = filterConfig.resolvedTerm
  const value = row.getValue(columnId)
  let valueStr: string
  if (typeof value === 'string') {
    valueStr = value.toLowerCase()
    if (!filterConfig.ignoreNewlines)
      // Replace all newlines with spaces
      // IMPORTANT number of characters must not be changed by replace here
      valueStr = valueStr.replace(/\n/g, ' ')
  } else {
    return false
  }
  const ranges = find(valueStr, term, filterConfig.highlightAll)
  if (ranges.length) {
    // Store ranges in filter meta for current column
    addMeta({
      ...row.columnFiltersMeta[columnId],
      columnFilterRanges: ranges,
    })
    return true
  }
  return false
}

columnFilterWithHighlighting.resolveFilterValue = function (
  filterValue: ColumnFilterWithHighlightingConfig
): ResolvedColumnFilterWithHighlightingConfig {
  return { ...filterValue, resolvedTerm: filterValue.term.toLowerCase() }
}

export function getHighlightRanges(cellContext: CellContext<any, string>) {
  // Highlight ranges stored in columnFiltersMeta
  // globalFilterRanges from global filter
  // columnFilterRanges from individual column filter
  // Meta may remain even if filter is empty so we have to check if filter is empty
  const globalFilter = cellContext.table.getState().globalFilter as
    | GlobalFilterWithHighlightingConfig
    | undefined
  const globalFilterRanges = globalFilter?.term
    ? cellContext.row.columnFiltersMeta[cellContext.column.id]
        ?.globalFilterRanges
    : undefined
  const columnFilter = cellContext.column.getFilterValue() as
    | ColumnFilterWithHighlightingConfig
    | undefined
  const columnFilterRanges = columnFilter?.term
    ? cellContext.row.columnFiltersMeta[cellContext.column.id]
        ?.columnFilterRanges
    : undefined

  // Concat all ranges in one array
  // Sort ranges by start index
  let ranges = [
    ...(globalFilterRanges ?? []),
    ...(columnFilterRanges ?? []),
  ].sort(
    (rangeA, rangeB) =>
      rangeA[HIGHLIGHT_RANGE_START] - rangeB[HIGHLIGHT_RANGE_START]
  )

  // Merge ranges if they overlap
  let i = 0
  let j = 1
  while (j < ranges.length) {
    if (ranges[i]![HIGHLIGHT_RANGE_END] >= ranges[j]![HIGHLIGHT_RANGE_START]) {
      ranges[j]![HIGHLIGHT_RANGE_START] = ranges[i]![HIGHLIGHT_RANGE_START]
      ranges[j]![HIGHLIGHT_RANGE_END] = Math.max(
        ranges[i]![HIGHLIGHT_RANGE_END],
        ranges[j]![HIGHLIGHT_RANGE_END]
      )
      ranges.splice(i, 1)
    } else {
      i++
      j++
    }
  }
  return ranges
}
