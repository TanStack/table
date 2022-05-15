import {
  Column,
  CoreHeader,
  Header,
  HeaderGroup,
  TableGenerics,
  TableInstance,
} from '../types'
import { memo } from '../utils'

export type HeadersInstance<TGenerics extends TableGenerics> = {
  createHeader: (
    column: Column<TGenerics>,
    options: {
      id?: string
      isPlaceholder?: boolean
      placeholderId?: string
      index: number
      depth: number
    }
  ) => Header<TGenerics>
  getHeaderGroups: () => HeaderGroup<TGenerics>[]
  getLeftHeaderGroups: () => HeaderGroup<TGenerics>[]
  getCenterHeaderGroups: () => HeaderGroup<TGenerics>[]
  getRightHeaderGroups: () => HeaderGroup<TGenerics>[]

  getFooterGroups: () => HeaderGroup<TGenerics>[]
  getLeftFooterGroups: () => HeaderGroup<TGenerics>[]
  getCenterFooterGroups: () => HeaderGroup<TGenerics>[]
  getRightFooterGroups: () => HeaderGroup<TGenerics>[]

  getFlatHeaders: () => Header<TGenerics>[]
  getLeftFlatHeaders: () => Header<TGenerics>[]
  getCenterFlatHeaders: () => Header<TGenerics>[]
  getRightFlatHeaders: () => Header<TGenerics>[]

  getLeafHeaders: () => Header<TGenerics>[]
  getLeftLeafHeaders: () => Header<TGenerics>[]
  getCenterLeafHeaders: () => Header<TGenerics>[]
  getRightLeafHeaders: () => Header<TGenerics>[]

  getHeader: (id: string) => Header<TGenerics>
}

//

export const Headers = {
  createInstance: <TGenerics extends TableGenerics>(
    instance: TableInstance<TGenerics>
  ): HeadersInstance<TGenerics> => {
    return {
      createHeader: (
        column: Column<TGenerics>,
        options: {
          id?: string
          isPlaceholder?: boolean
          placeholderId?: string
          index: number
          depth: number
        }
      ) => {
        const id = options.id ?? column.id

        let header: CoreHeader<TGenerics> = {
          id,
          column,
          index: options.index,
          isPlaceholder: options.isPlaceholder,
          placeholderId: options.placeholderId,
          depth: options.depth,
          subHeaders: [],
          colSpan: 0,
          rowSpan: 0,
          headerGroup: null!,
          getLeafHeaders: (): Header<TGenerics>[] => {
            const leafHeaders: CoreHeader<TGenerics>[] = []

            const recurseHeader = (h: CoreHeader<TGenerics>) => {
              if (h.subHeaders && h.subHeaders.length) {
                h.subHeaders.map(recurseHeader)
              }
              leafHeaders.push(h)
            }

            recurseHeader(header)

            return leafHeaders as Header<TGenerics>[]
          },
          renderHeader: () =>
            column.header
              ? instance._render(column.header, {
                  instance,
                  header: header as Header<TGenerics>,
                  column,
                })
              : null,
          renderFooter: () =>
            column.footer
              ? instance._render(column.footer, {
                  instance,
                  header: header as Header<TGenerics>,
                  column,
                })
              : null,
        }

        instance._features.forEach(feature => {
          Object.assign(header, feature.createHeader?.(header, instance))
        })

        return header as Header<TGenerics>
      },

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

      getHeader: (id: string) => {
        const header = [
          ...instance.getFlatHeaders(),
          ...instance.getCenterFlatHeaders(),
          ...instance.getLeftFlatHeaders(),
          ...instance.getRightFlatHeaders(),
        ].find(d => d.id === id)

        if (!header) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(`Could not find header with id: ${id}`)
          }
          throw new Error()
        }

        return header
      },
    }
  },
}

export function buildHeaderGroups<TGenerics extends TableGenerics>(
  allColumns: Column<TGenerics>[],
  columnsToGroup: Column<TGenerics>[],
  instance: TableInstance<TGenerics>,
  headerFamily?: 'center' | 'left' | 'right'
) {
  // Find the max depth of the columns:
  // build the leaf column row
  // build each buffer row going up
  //    placeholder for non-existent level
  //    real column for existing level

  let maxDepth = 0

  const findMaxDepth = (columns: Column<TGenerics>[], depth = 1) => {
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

  let headerGroups: HeaderGroup<TGenerics>[] = []

  const createHeaderGroup = (
    headersToGroup: Header<TGenerics>[],
    depth: number
  ) => {
    // The header group we are creating
    const headerGroup: HeaderGroup<TGenerics> = {
      depth,
      id: [headerFamily, `${depth}`].filter(Boolean).join('_'),
      headers: [],
    }

    // The parent columns we're going to scan next
    const pendingParentHeaders: Header<TGenerics>[] = []

    // Scan each column for parents
    headersToGroup.forEach(headerToGroup => {
      // What is the latest (last) parent column?

      const latestPendingParentHeader = [...pendingParentHeaders].reverse()[0]

      const isLeafHeader = headerToGroup.column.depth === headerGroup.depth

      let column: Column<TGenerics>
      let isPlaceholder = false

      if (isLeafHeader && headerToGroup.column.parent) {
        // The parent header is new
        column = headerToGroup.column.parent
      } else {
        // The parent header is repeated
        column = headerToGroup.column
        isPlaceholder = true
      }

      if (latestPendingParentHeader?.column === column) {
        // This column is repeated. Add it as a sub header to the next batch
        latestPendingParentHeader.subHeaders.push(headerToGroup)
      } else {
        // This is a new header. Let's create it
        const header = instance.createHeader(column, {
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
    instance.createHeader(column, {
      depth: maxDepth,
      index,
    })
  )

  createHeaderGroup(bottomHeaders, maxDepth - 1)

  headerGroups.reverse()

  // headerGroups = headerGroups.filter(headerGroup => {
  //   return !headerGroup.headers.every(header => header.isPlaceholder)
  // })

  const recurseHeadersForSpans = (headers: Header<TGenerics>[]) => {
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

      header.colSpan = colSpan > 0 ? colSpan : undefined
      header.rowSpan = rowSpan > 0 ? rowSpan : undefined

      return { colSpan, rowSpan }
    })
  }

  recurseHeadersForSpans(headerGroups[0]?.headers ?? [])

  return headerGroups
}
