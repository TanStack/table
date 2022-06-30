import { RowData, Column, Header, HeaderGroup, Table } from '../types'
import { memo } from '../utils'
import { TableFeature } from './instance'

export type CoreHeaderGroup<TData extends RowData> = {
  id: string
  depth: number
  headers: Header<TData>[]
}

export type CoreHeader<TData extends RowData> = {
  id: string
  index: number
  depth: number
  column: Column<TData, unknown>
  headerGroup: HeaderGroup<TData>
  subHeaders: Header<TData>[]
  colSpan: number
  rowSpan: number
  getLeafHeaders: () => Header<TData>[]
  isPlaceholder: boolean
  placeholderId?: string
  getContext: () => {
    instance: Table<TData>
    header: Header<TData>
    column: Column<TData, unknown>
  }
}

export type HeadersInstance<TData extends RowData> = {
  getHeaderGroups: () => HeaderGroup<TData>[]
  getLeftHeaderGroups: () => HeaderGroup<TData>[]
  getCenterHeaderGroups: () => HeaderGroup<TData>[]
  getRightHeaderGroups: () => HeaderGroup<TData>[]

  getFooterGroups: () => HeaderGroup<TData>[]
  getLeftFooterGroups: () => HeaderGroup<TData>[]
  getCenterFooterGroups: () => HeaderGroup<TData>[]
  getRightFooterGroups: () => HeaderGroup<TData>[]

  getFlatHeaders: () => Header<TData>[]
  getLeftFlatHeaders: () => Header<TData>[]
  getCenterFlatHeaders: () => Header<TData>[]
  getRightFlatHeaders: () => Header<TData>[]

  getLeafHeaders: () => Header<TData>[]
  getLeftLeafHeaders: () => Header<TData>[]
  getCenterLeafHeaders: () => Header<TData>[]
  getRightLeafHeaders: () => Header<TData>[]
}

//

function createHeader<TData extends RowData>(
  instance: Table<TData>,
  column: Column<TData, unknown>,
  options: {
    id?: string
    isPlaceholder?: boolean
    placeholderId?: string
    index: number
    depth: number
  }
) {
  const id = options.id ?? column.id

  let header: CoreHeader<TData> = {
    id,
    column,
    index: options.index,
    isPlaceholder: !!options.isPlaceholder,
    placeholderId: options.placeholderId,
    depth: options.depth,
    subHeaders: [],
    colSpan: 0,
    rowSpan: 0,
    headerGroup: null!,
    getLeafHeaders: (): Header<TData>[] => {
      const leafHeaders: CoreHeader<TData>[] = []

      const recurseHeader = (h: CoreHeader<TData>) => {
        if (h.subHeaders && h.subHeaders.length) {
          h.subHeaders.map(recurseHeader)
        }
        leafHeaders.push(h)
      }

      recurseHeader(header)

      return leafHeaders as Header<TData>[]
    },
    getContext: () => ({
      instance,
      header: header as Header<TData>,
      column,
    }),
  }

  instance._features.forEach(feature => {
    Object.assign(header, feature.createHeader?.(header, instance))
  })

  return header as Header<TData>
}

export const Headers: TableFeature = {
  createTable: <TData extends RowData>(
    instance: Table<TData>
  ): HeadersInstance<TData> => {
    return {
      // Header Groups

      getHeaderGroups: memo(
        () => [
          instance.getAllColumns(),
          instance.getVisibleLeafColumns(),
          instance.getState().columnPinning.left,
          instance.getState().columnPinning.right,
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
            instance
          )

          return headerGroups
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getHeaderGroups',
          debug: () =>
            instance.options.debugAll ?? instance.options.debugHeaders,
        }
      ),

      getCenterHeaderGroups: memo(
        () => [
          instance.getAllColumns(),
          instance.getVisibleLeafColumns(),
          instance.getState().columnPinning.left,
          instance.getState().columnPinning.right,
        ],
        (allColumns, leafColumns, left, right) => {
          leafColumns = leafColumns.filter(
            column => !left?.includes(column.id) && !right?.includes(column.id)
          )
          return buildHeaderGroups(allColumns, leafColumns, instance, 'center')
        },
        {
          key:
            process.env.NODE_ENV === 'development' && 'getCenterHeaderGroups',
          debug: () =>
            instance.options.debugAll ?? instance.options.debugHeaders,
        }
      ),

      getLeftHeaderGroups: memo(
        () => [
          instance.getAllColumns(),
          instance.getVisibleLeafColumns(),
          instance.getState().columnPinning.left,
        ],
        (allColumns, leafColumns, left) => {
          const orderedLeafColumns =
            left
              ?.map(columnId => leafColumns.find(d => d.id === columnId)!)
              .filter(Boolean) ?? []

          return buildHeaderGroups(
            allColumns,
            orderedLeafColumns,
            instance,
            'left'
          )
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getLeftHeaderGroups',
          debug: () =>
            instance.options.debugAll ?? instance.options.debugHeaders,
        }
      ),

      getRightHeaderGroups: memo(
        () => [
          instance.getAllColumns(),
          instance.getVisibleLeafColumns(),
          instance.getState().columnPinning.right,
        ],
        (allColumns, leafColumns, right) => {
          const orderedLeafColumns =
            right
              ?.map(columnId => leafColumns.find(d => d.id === columnId)!)
              .filter(Boolean) ?? []

          return buildHeaderGroups(
            allColumns,
            orderedLeafColumns,
            instance,
            'right'
          )
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getRightHeaderGroups',
          debug: () =>
            instance.options.debugAll ?? instance.options.debugHeaders,
        }
      ),

      // Footer Groups

      getFooterGroups: memo(
        () => [instance.getHeaderGroups()],
        headerGroups => {
          return [...headerGroups].reverse()
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getFooterGroups',
          debug: () =>
            instance.options.debugAll ?? instance.options.debugHeaders,
        }
      ),

      getLeftFooterGroups: memo(
        () => [instance.getLeftHeaderGroups()],
        headerGroups => {
          return [...headerGroups].reverse()
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getLeftFooterGroups',
          debug: () =>
            instance.options.debugAll ?? instance.options.debugHeaders,
        }
      ),

      getCenterFooterGroups: memo(
        () => [instance.getCenterHeaderGroups()],
        headerGroups => {
          return [...headerGroups].reverse()
        },
        {
          key:
            process.env.NODE_ENV === 'development' && 'getCenterFooterGroups',
          debug: () =>
            instance.options.debugAll ?? instance.options.debugHeaders,
        }
      ),

      getRightFooterGroups: memo(
        () => [instance.getRightHeaderGroups()],
        headerGroups => {
          return [...headerGroups].reverse()
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getRightFooterGroups',
          debug: () =>
            instance.options.debugAll ?? instance.options.debugHeaders,
        }
      ),

      // Flat Headers

      getFlatHeaders: memo(
        () => [instance.getHeaderGroups()],
        headerGroups => {
          return headerGroups
            .map(headerGroup => {
              return headerGroup.headers
            })
            .flat()
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getFlatHeaders',
          debug: () =>
            instance.options.debugAll ?? instance.options.debugHeaders,
        }
      ),

      getLeftFlatHeaders: memo(
        () => [instance.getLeftHeaderGroups()],
        left => {
          return left
            .map(headerGroup => {
              return headerGroup.headers
            })
            .flat()
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getLeftFlatHeaders',
          debug: () =>
            instance.options.debugAll ?? instance.options.debugHeaders,
        }
      ),

      getCenterFlatHeaders: memo(
        () => [instance.getCenterHeaderGroups()],
        left => {
          return left
            .map(headerGroup => {
              return headerGroup.headers
            })
            .flat()
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getCenterFlatHeaders',
          debug: () =>
            instance.options.debugAll ?? instance.options.debugHeaders,
        }
      ),

      getRightFlatHeaders: memo(
        () => [instance.getRightHeaderGroups()],
        left => {
          return left
            .map(headerGroup => {
              return headerGroup.headers
            })
            .flat()
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getRightFlatHeaders',
          debug: () =>
            instance.options.debugAll ?? instance.options.debugHeaders,
        }
      ),

      // Leaf Headers

      getCenterLeafHeaders: memo(
        () => [instance.getCenterFlatHeaders()],
        flatHeaders => {
          return flatHeaders.filter(header => !header.subHeaders?.length)
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getCenterLeafHeaders',
          debug: () =>
            instance.options.debugAll ?? instance.options.debugHeaders,
        }
      ),

      getLeftLeafHeaders: memo(
        () => [instance.getLeftFlatHeaders()],
        flatHeaders => {
          return flatHeaders.filter(header => !header.subHeaders?.length)
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getLeftLeafHeaders',
          debug: () =>
            instance.options.debugAll ?? instance.options.debugHeaders,
        }
      ),

      getRightLeafHeaders: memo(
        () => [instance.getRightFlatHeaders()],
        flatHeaders => {
          return flatHeaders.filter(header => !header.subHeaders?.length)
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getRightLeafHeaders',
          debug: () =>
            instance.options.debugAll ?? instance.options.debugHeaders,
        }
      ),

      getLeafHeaders: memo(
        () => [
          instance.getLeftHeaderGroups(),
          instance.getCenterHeaderGroups(),
          instance.getRightHeaderGroups(),
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
          debug: () =>
            instance.options.debugAll ?? instance.options.debugHeaders,
        }
      ),
    }
  },
}

export function buildHeaderGroups<TData extends RowData>(
  allColumns: Column<TData, unknown>[],
  columnsToGroup: Column<TData, unknown>[],
  instance: Table<TData>,
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

  findMaxDepth(allColumns)

  let headerGroups: HeaderGroup<TData>[] = []

  const createHeaderGroup = (
    headersToGroup: Header<TData>[],
    depth: number
  ) => {
    // The header group we are creating
    const headerGroup: HeaderGroup<TData> = {
      depth,
      id: [headerFamily, `${depth}`].filter(Boolean).join('_'),
      headers: [],
    }

    // The parent columns we're going to scan next
    const pendingParentHeaders: Header<TData>[] = []

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
        latestPendingParentHeader.subHeaders.push(headerToGroup)
      } else {
        // This is a new header. Let's create it
        const header = createHeader(instance, column, {
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
    createHeader(instance, column, {
      depth: maxDepth,
      index,
    })
  )

  createHeaderGroup(bottomHeaders, maxDepth - 1)

  headerGroups.reverse()

  // headerGroups = headerGroups.filter(headerGroup => {
  //   return !headerGroup.headers.every(header => header.isPlaceholder)
  // })

  const recurseHeadersForSpans = (
    headers: Header<TData>[]
  ): { colSpan: number; rowSpan: number }[] => {
    const filteredHeaders = headers.filter(header =>
      header.column.getIsVisible()
    )

    return filteredHeaders.map(header => {
      let colSpan = 0
      let rowSpan = 0
      let childRowSpans = [0]

      if (header.subHeaders && header.subHeaders.length) {
        childRowSpans = []

        recurseHeadersForSpans(header.subHeaders).forEach(
          ({ colSpan: childColSpan, rowSpan: childRowSpan }) => {
            colSpan += childColSpan
            childRowSpans.push(childRowSpan)
          }
        )
      } else {
        colSpan = 1
      }

      const minChildRowSpan = Math.min(...childRowSpans)
      rowSpan = rowSpan + minChildRowSpan

      header.colSpan = colSpan
      header.rowSpan = rowSpan

      return { colSpan, rowSpan }
    })
  }

  recurseHeadersForSpans(headerGroups[0]?.headers ?? [])

  return headerGroups
}
