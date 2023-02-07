import { RowData, Column, Header, HeaderGroup, Table } from '../types'
import { memo } from '../utils'
import { TableFeature } from './table'

export interface CoreHeaderGroup<TData extends RowData> {
  id: string
  depth: number
  headers: Header<TData, unknown>[]
}

export interface HeaderContext<TData, TValue> {
  table: Table<TData>
  header: Header<TData, TValue>
  column: Column<TData, TValue>
}

export interface CoreHeader<TData extends RowData, TValue> {
  id: string
  index: number
  depth: number
  column: Column<TData, TValue>
  headerGroup: HeaderGroup<TData>
  subHeaders: Header<TData, TValue>[]
  parentHeaderId?: string
  getParentHeader: () => Header<TData, unknown> | undefined
  colSpan: number
  rowSpan: number
  isCover?: boolean
  getLeafHeaders: () => Header<TData, unknown>[]
  isPlaceholder: boolean
  placeholderId?: string
  getContext: () => HeaderContext<TData, TValue>
}

export interface HeadersInstance<TData extends RowData> {
  getHeaderGroups: () => HeaderGroup<TData>[]
  getLeftHeaderGroups: () => HeaderGroup<TData>[]
  getCenterHeaderGroups: () => HeaderGroup<TData>[]
  getRightHeaderGroups: () => HeaderGroup<TData>[]

  getFooterGroups: () => HeaderGroup<TData>[]
  getLeftFooterGroups: () => HeaderGroup<TData>[]
  getCenterFooterGroups: () => HeaderGroup<TData>[]
  getRightFooterGroups: () => HeaderGroup<TData>[]

  getFlatHeaders: () => Header<TData, unknown>[]
  getLeftFlatHeaders: () => Header<TData, unknown>[]
  getCenterFlatHeaders: () => Header<TData, unknown>[]
  getRightFlatHeaders: () => Header<TData, unknown>[]

  getLeafHeaders: () => Header<TData, unknown>[]
  getLeftLeafHeaders: () => Header<TData, unknown>[]
  getCenterLeafHeaders: () => Header<TData, unknown>[]
  getRightLeafHeaders: () => Header<TData, unknown>[]
}

//

function createHeader<TData extends RowData, TValue>(
  table: Table<TData>,
  column: Column<TData, TValue>,
  options: {
    id?: string
    isPlaceholder?: boolean
    placeholderId?: string
    index: number
    depth: number
  }
): Header<TData, TValue> {
  const id = options.id ?? column.id

  let header: CoreHeader<TData, TValue> = {
    id,
    column,
    index: options.index,
    isPlaceholder: !!options.isPlaceholder,
    placeholderId: options.placeholderId,
    depth: options.depth,
    subHeaders: [],
    getParentHeader: () => undefined,
    colSpan: 0,
    rowSpan: 0,
    headerGroup: null!,
    getLeafHeaders: (): Header<TData, unknown>[] => {
      const leafHeaders: Header<TData, unknown>[] = []

      const recurseHeader = (h: CoreHeader<TData, any>) => {
        if (h.subHeaders && h.subHeaders.length) {
          h.subHeaders.map(recurseHeader)
        }
        leafHeaders.push(h as Header<TData, unknown>)
      }

      recurseHeader(header)

      return leafHeaders
    },
    getContext: () => ({
      table,
      header: header as Header<TData, TValue>,
      column,
    }),
  }

  table._features.forEach(feature => {
    Object.assign(header, feature.createHeader?.(header, table))
  })

  return header as Header<TData, TValue>
}

export const Headers: TableFeature = {
  createTable: <TData extends RowData>(
    table: Table<TData>
  ): HeadersInstance<TData> => {
    return {
      // Header Groups

      getHeaderGroups: memo(
        () => [
          table.getAllColumns(),
          table.getVisibleLeafColumns(),
          table.getState().columnPinning.left,
          table.getState().columnPinning.right,
        ],
        (allColumns, leafColumns, left, right) => {
          const leftColumns =
            left
              ?.map(columnId => leafColumns.find(d => d.id === columnId)!)
              .filter(Boolean) ?? []

          const rightColumns =
            right
              ?.map(columnId => leafColumns.find(d => d.id === columnId)!)
              .filter(Boolean) ?? []

          const centerColumns = leafColumns.filter(
            column => !left?.includes(column.id) && !right?.includes(column.id)
          )

          const headerGroups = buildHeaderGroups(
            allColumns,
            [...leftColumns, ...centerColumns, ...rightColumns],
            table
          )

          return headerGroups
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getHeaderGroups',
          debug: () => table.options.debugAll ?? table.options.debugHeaders,
        }
      ),

      getCenterHeaderGroups: memo(
        () => [
          table.getAllColumns(),
          table.getVisibleLeafColumns(),
          table.getState().columnPinning.left,
          table.getState().columnPinning.right,
        ],
        (allColumns, leafColumns, left, right) => {
          leafColumns = leafColumns.filter(
            column => !left?.includes(column.id) && !right?.includes(column.id)
          )
          return buildHeaderGroups(allColumns, leafColumns, table, 'center')
        },
        {
          key:
            process.env.NODE_ENV === 'development' && 'getCenterHeaderGroups',
          debug: () => table.options.debugAll ?? table.options.debugHeaders,
        }
      ),

      getLeftHeaderGroups: memo(
        () => [
          table.getAllColumns(),
          table.getVisibleLeafColumns(),
          table.getState().columnPinning.left,
        ],
        (allColumns, leafColumns, left) => {
          const orderedLeafColumns =
            left
              ?.map(columnId => leafColumns.find(d => d.id === columnId)!)
              .filter(Boolean) ?? []

          return buildHeaderGroups(
            allColumns,
            orderedLeafColumns,
            table,
            'left'
          )
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getLeftHeaderGroups',
          debug: () => table.options.debugAll ?? table.options.debugHeaders,
        }
      ),

      getRightHeaderGroups: memo(
        () => [
          table.getAllColumns(),
          table.getVisibleLeafColumns(),
          table.getState().columnPinning.right,
        ],
        (allColumns, leafColumns, right) => {
          const orderedLeafColumns =
            right
              ?.map(columnId => leafColumns.find(d => d.id === columnId)!)
              .filter(Boolean) ?? []

          return buildHeaderGroups(
            allColumns,
            orderedLeafColumns,
            table,
            'right'
          )
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getRightHeaderGroups',
          debug: () => table.options.debugAll ?? table.options.debugHeaders,
        }
      ),

      // Footer Groups

      getFooterGroups: memo(
        () => [table.getHeaderGroups()],
        headerGroups => {
          return [...headerGroups].reverse()
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getFooterGroups',
          debug: () => table.options.debugAll ?? table.options.debugHeaders,
        }
      ),

      getLeftFooterGroups: memo(
        () => [table.getLeftHeaderGroups()],
        headerGroups => {
          return [...headerGroups].reverse()
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getLeftFooterGroups',
          debug: () => table.options.debugAll ?? table.options.debugHeaders,
        }
      ),

      getCenterFooterGroups: memo(
        () => [table.getCenterHeaderGroups()],
        headerGroups => {
          return [...headerGroups].reverse()
        },
        {
          key:
            process.env.NODE_ENV === 'development' && 'getCenterFooterGroups',
          debug: () => table.options.debugAll ?? table.options.debugHeaders,
        }
      ),

      getRightFooterGroups: memo(
        () => [table.getRightHeaderGroups()],
        headerGroups => {
          return [...headerGroups].reverse()
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getRightFooterGroups',
          debug: () => table.options.debugAll ?? table.options.debugHeaders,
        }
      ),

      // Flat Headers

      getFlatHeaders: memo(
        () => [table.getHeaderGroups()],
        headerGroups => {
          return headerGroups
            .map(headerGroup => {
              return headerGroup.headers
            })
            .flat()
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getFlatHeaders',
          debug: () => table.options.debugAll ?? table.options.debugHeaders,
        }
      ),

      getLeftFlatHeaders: memo(
        () => [table.getLeftHeaderGroups()],
        left => {
          return left
            .map(headerGroup => {
              return headerGroup.headers
            })
            .flat()
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getLeftFlatHeaders',
          debug: () => table.options.debugAll ?? table.options.debugHeaders,
        }
      ),

      getCenterFlatHeaders: memo(
        () => [table.getCenterHeaderGroups()],
        left => {
          return left
            .map(headerGroup => {
              return headerGroup.headers
            })
            .flat()
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getCenterFlatHeaders',
          debug: () => table.options.debugAll ?? table.options.debugHeaders,
        }
      ),

      getRightFlatHeaders: memo(
        () => [table.getRightHeaderGroups()],
        left => {
          return left
            .map(headerGroup => {
              return headerGroup.headers
            })
            .flat()
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getRightFlatHeaders',
          debug: () => table.options.debugAll ?? table.options.debugHeaders,
        }
      ),

      // Leaf Headers

      getCenterLeafHeaders: memo(
        () => [table.getCenterFlatHeaders()],
        flatHeaders => {
          return flatHeaders.filter(header => !header.subHeaders?.length)
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getCenterLeafHeaders',
          debug: () => table.options.debugAll ?? table.options.debugHeaders,
        }
      ),

      getLeftLeafHeaders: memo(
        () => [table.getLeftFlatHeaders()],
        flatHeaders => {
          return flatHeaders.filter(header => !header.subHeaders?.length)
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getLeftLeafHeaders',
          debug: () => table.options.debugAll ?? table.options.debugHeaders,
        }
      ),

      getRightLeafHeaders: memo(
        () => [table.getRightFlatHeaders()],
        flatHeaders => {
          return flatHeaders.filter(header => !header.subHeaders?.length)
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getRightLeafHeaders',
          debug: () => table.options.debugAll ?? table.options.debugHeaders,
        }
      ),

      getLeafHeaders: memo(
        () => [
          table.getLeftHeaderGroups(),
          table.getCenterHeaderGroups(),
          table.getRightHeaderGroups(),
        ],
        (left, center, right) => {
          return [
            ...(left[0]?.headers ?? []),
            ...(center[0]?.headers ?? []),
            ...(right[0]?.headers ?? []),
          ]
            .map(header => {
              return header.getLeafHeaders()
            })
            .flat()
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getLeafHeaders',
          debug: () => table.options.debugAll ?? table.options.debugHeaders,
        }
      ),
    }
  },
}

export function buildHeaderGroups<TData extends RowData>(
  allColumns: Column<TData, unknown>[],
  columnsToGroup: Column<TData, unknown>[],
  table: Table<TData>,
  headerFamily?: 'center' | 'left' | 'right'
) {
  // Find the max depth of the columns:
  // build the leaf column row
  // build each buffer row going up
  //    placeholder for non-existent level
  //    real column for existing level

  let maxDepth = 0

  const findMaxDepth = (columns: Column<TData, unknown>[], depth = 1) => {
    maxDepth = Math.max(maxDepth, depth)

    columns
      .filter(column => column.getIsVisible())
      .forEach(column => {
        if (column.columns?.length) {
          findMaxDepth(column.columns, depth + 1)
        }
      }, 0)
  }
  const filterHideColumns = (
    columns: Column<TData, unknown>[]
  ): Column<TData, unknown>[] => {
    return columns.filter(column => {
      if (column.columns?.length) {
        return filterHideColumns(column.columns).length > 0
      } else {
        return column.getIsVisible()
      }
    })
  }
  const allShowColumns = filterHideColumns(allColumns)
  findMaxDepth(allShowColumns)
  let headerGroups: HeaderGroup<TData>[] = []

  const createHeaderGroup = (
    headersToGroup: Header<TData, unknown>[],
    depth: number
  ) => {
    // The header group we are creating
    const headerGroup: HeaderGroup<TData> = {
      depth,
      id: [headerFamily, `${depth}`].filter(Boolean).join('_'),
      headers: [],
    }

    // The parent columns we're going to scan next
    const pendingParentHeaders: Header<TData, unknown>[] = []

    // Scan each column for parents
    headersToGroup.forEach(headerToGroup => {
      // What is the latest (last) parent column?

      const latestPendingParentHeader = [...pendingParentHeaders].reverse()[0]

      const isLeafHeader = headerToGroup.column.depth === headerGroup.depth

      let column: Column<TData, unknown>
      let isPlaceholder = false

      if (isLeafHeader && headerToGroup.column.parent) {
        // The parent header is new
        column = headerToGroup.column.parent
      } else {
        // The parent header is repeated
        column = headerToGroup.column
        isPlaceholder = true
      }

      if (
        latestPendingParentHeader &&
        latestPendingParentHeader?.column === column
      ) {
        // This column is repeated. Add it as a sub header to the next batch
        if (depth > 0) {
          headerToGroup.parentHeaderId = latestPendingParentHeader.id
          headerToGroup.getParentHeader = () => latestPendingParentHeader
        }
        latestPendingParentHeader.subHeaders.push(headerToGroup)
      } else {
        // This is a new header. Let's create it
        const header = createHeader(table, column, {
          id: [headerFamily, depth, column.id, headerToGroup?.id]
            .filter(Boolean)
            .join('_'),
          isPlaceholder,
          placeholderId: isPlaceholder
            ? `${pendingParentHeaders.filter(d => d.column === column).length}`
            : undefined,
          depth,
          index: pendingParentHeaders.length,
        })
        if (depth > 0) {
          headerToGroup.parentHeaderId = header.id
          headerToGroup.getParentHeader = () => header
        }

        // Add the headerToGroup as a subHeader of the new header
        header.subHeaders.push(headerToGroup)
        // Add the new header to the pendingParentHeaders to get grouped
        // in the next batch
        pendingParentHeaders.push(header)
      }

      headerGroup.headers.push(headerToGroup)
      headerToGroup.headerGroup = headerGroup
    })

    headerGroups.push(headerGroup)

    if (depth > 0) {
      createHeaderGroup(pendingParentHeaders, depth - 1)
    }
  }

  const bottomHeaders = columnsToGroup.map((column, index) =>
    createHeader(table, column, {
      depth: maxDepth,
      index,
    })
  )

  createHeaderGroup(bottomHeaders, maxDepth - 1)
  const leafHeaders = headerGroups[0]?.headers ?? []
  leafHeaders.forEach(leafHeader => {
    const colHeaders: Header<TData, unknown>[] = []
    const recurseHeaders = function (header: Header<TData, unknown>) {
      colHeaders.push(header)
      const parentHeader = header.getParentHeader()
      if (parentHeader) {
        recurseHeaders(parentHeader)
      }
    }
    recurseHeaders(leafHeader)
    colHeaders.reverse()
    const containerLength = maxDepth
    const sumColumnDepth = Math.max(...colHeaders.map(h => h.column.depth)) + 1
    const items: number[] = colHeaders.slice(0, sumColumnDepth).map(i => i.column.rowSpanGrow||0);
    new Array(containerLength).fill(null).map(() => ({
      rowSpan: 1,
      isCover: false
    })).map((item, i) => {
      const sizeItems = items.map((i, k, arr) => {
        // 待分配项目
        const assignedItems: number[] = arr.filter(i => i);
        if (assignedItems.length === 0) {
          return 1;
        }
        // 可分配空间
        const allocatableSpace = containerLength -
          arr.filter(i => i === 0).length;
        // 待分配空间
        const assignedSpace = assignedItems.reduce((acc, i) => acc + i, 0);
        if (i !== 0) {
          console.log("allocatableSpace", i, assignedSpace, allocatableSpace);

          return Math.round((i / assignedSpace )* allocatableSpace);
        } else {
          return 1;
        }
      });
      if (items.some(i => i > 0)) {
        const sum = sizeItems.reduce((acc, i) => acc + i);
        if (sum > containerLength) {
          [...sizeItems].map((i, k) => ({
            value: i,
            index: k
          })).sort((a, b) => a.value - b.value).forEach((i, k) => {
            if (k < sum - containerLength) {
              sizeItems[i.index] = i.value - 1;
            }
          });
        } else if (sum < containerLength) {
          sizeItems[sizeItems.length - 1] += containerLength - sum;
        }
        const allSizeItem = sizeItems.map(i => (new Array(i).fill(i).fill(0, 1))).flat()
        if(allSizeItem[i]===0){
          item.rowSpan = 0
          item.isCover = true
        } else {
          item.rowSpan = allSizeItem[i]
          item.isCover = false
        }
      }
      return item
    }).forEach((item, k) => {
      const currentGrow =  colHeaders[k]
      if(currentGrow){
        currentGrow.rowSpan = item.rowSpan
        currentGrow.isCover = item.isCover
      }
    })
  })
  headerGroups.reverse()
  const recurseHeadersForSpans = (
    headers: Header<TData, unknown>[]
  ): { colSpan: number }[] => {
    const filteredHeaders = headers.filter(header =>
      header.column.getIsVisible()
    )
    return filteredHeaders.map(header => {
      let colSpan = 0
      if (header.subHeaders && header.subHeaders.length) {
        recurseHeadersForSpans(header.subHeaders).forEach(
          ({ colSpan: childColSpan }) => {
            colSpan += childColSpan
          }
        )
      } else {
        colSpan = 1
      }
      header.colSpan = colSpan
      return { colSpan }
    })
  }
  recurseHeadersForSpans(headerGroups[0]?.headers ?? [])
  return headerGroups
}
