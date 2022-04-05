import {
  Cell,
  Column,
  CoreHeader,
  FooterGroupProps,
  FooterProps,
  Getter,
  Header,
  HeaderGroup,
  HeaderGroupProps,
  HeaderProps,
  AnyGenerics,
  PartialGenerics,
  PropGetterValue,
  TableInstance,
  Row,
} from '../types'
import { propGetter, memo } from '../utils'
import { ColumnSizing } from './ColumnSizing'

export type HeadersRow<TGenerics extends PartialGenerics> = {
  _getAllVisibleCells: () => Cell<TGenerics>[]
  getVisibleCells: () => Cell<TGenerics>[]
  getLeftVisibleCells: () => Cell<TGenerics>[]
  getCenterVisibleCells: () => Cell<TGenerics>[]
  getRightVisibleCells: () => Cell<TGenerics>[]
}

export type HeadersInstance<TGenerics extends PartialGenerics> = {
  createHeader: (
    column: Column<TGenerics>,
    options: {
      id?: string
      isPlaceholder?: boolean
      placeholderId?: string
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

  getHeaderGroupProps: <TGetter extends Getter<HeaderGroupProps>>(
    id: string,
    userProps?: TGetter
  ) => undefined | PropGetterValue<HeaderGroupProps, TGetter>
  getFooterGroupProps: <TGetter extends Getter<FooterGroupProps>>(
    id: string,
    userProps?: TGetter
  ) => undefined | PropGetterValue<FooterGroupProps, TGetter>
  getHeaderProps: <TGetter extends Getter<HeaderProps>>(
    headerId: string,
    userProps?: TGetter
  ) => undefined | PropGetterValue<HeaderProps, TGetter>
  getFooterProps: <TGetter extends Getter<FooterProps>>(
    headerId: string,
    userProps?: TGetter
  ) => undefined | PropGetterValue<FooterProps, TGetter>
  getTotalWidth: () => number
}

//

export const Headers = {
  createRow: <TGenerics extends PartialGenerics>(
    row: Row<TGenerics>,
    instance: TableInstance<TGenerics>
  ): HeadersRow<TGenerics> => {
    return {
      _getAllVisibleCells: memo(
        () => [
          row
            .getAllCells()
            .filter(cell => cell.column.getIsVisible())
            .map(d => d.id)
            .join('_'),
        ],
        _ => {
          return row.getAllCells().filter(cell => cell.column.getIsVisible())
        },
        {
          key: 'row._getAllVisibleCells',
          debug: () => instance.options.debugAll ?? instance.options.debugRows,
        }
      ),
      getVisibleCells: memo(
        () => [
          row.getLeftVisibleCells(),
          row.getCenterVisibleCells(),
          row.getRightVisibleCells(),
        ],
        (left, center, right) => [...left, ...center, ...right],
        {
          key: 'row.getVisibleCells',
          debug: () => instance.options.debugAll ?? instance.options.debugRows,
        }
      ),
      getCenterVisibleCells: memo(
        () => [
          row._getAllVisibleCells(),
          instance.getState().columnPinning.left,
          instance.getState().columnPinning.right,
        ],
        (allCells, left, right) => {
          const leftAndRight = [...(left ?? []), ...(right ?? [])]

          return allCells.filter(d => !leftAndRight.includes(d.columnId))
        },
        {
          key: 'row.getCenterVisibleCells',
          debug: () => instance.options.debugAll ?? instance.options.debugRows,
        }
      ),
      getLeftVisibleCells: memo(
        () => [
          row._getAllVisibleCells(),
          instance.getState().columnPinning.left,
          ,
        ],
        (allCells, left) => {
          const cells = (left ?? [])
            .map(columnId => allCells.find(cell => cell.columnId === columnId)!)
            .filter(Boolean)

          return cells
        },
        {
          key: 'row.getLeftVisibleCells',
          debug: () => instance.options.debugAll ?? instance.options.debugRows,
        }
      ),
      getRightVisibleCells: memo(
        () => [
          row._getAllVisibleCells(),
          instance.getState().columnPinning.right,
        ],
        (allCells, right) => {
          const cells = (right ?? [])
            .map(columnId => allCells.find(cell => cell.columnId === columnId)!)
            .filter(Boolean)

          return cells
        },
        {
          key: 'row.getRightVisibleCells',
          debug: () => instance.options.debugAll ?? instance.options.debugRows,
        }
      ),
    }
  },

  getInstance: <TGenerics extends PartialGenerics>(
    instance: TableInstance<TGenerics>
  ): HeadersInstance<TGenerics> => {
    return {
      createHeader: (
        column: Column<TGenerics>,
        options: {
          id?: string
          isPlaceholder?: boolean
          placeholderId?: string
          depth: number
        }
      ) => {
        const id = options.id ?? column.id

        let header: CoreHeader<TGenerics> = {
          id,
          column,
          isPlaceholder: options.isPlaceholder,
          placeholderId: options.placeholderId,
          depth: options.depth,
          subHeaders: [],
          colSpan: 0,
          rowSpan: 0,
          getWidth: () => {
            let sum = 0

            const recurse = (header: CoreHeader<TGenerics>) => {
              if (header.subHeaders.length) {
                header.subHeaders.forEach(recurse)
              } else {
                sum += header.column.getWidth() ?? 0
              }
            }

            recurse(header)

            return sum
          },
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
          getHeaderProps: userProps =>
            instance.getHeaderProps(header.id, userProps)!,
          getFooterProps: userProps =>
            instance.getFooterProps(header.id, userProps)!,
          renderHeader: () =>
            column.header
              ? instance.render(column.header, {
                  instance,
                  header: header as Header<TGenerics>,
                  column,
                })
              : null,
          renderFooter: () =>
            column.footer
              ? instance.render(column.footer, {
                  instance,
                  header: header as Header<TGenerics>,
                  column,
                })
              : null,
        }

        // Yes, we have to convert instance to unknown, because we know more than the compiler here.
        return Object.assign(
          header,
          ColumnSizing.createHeader(header as Header<TGenerics>, instance)
        ) as Header<TGenerics>
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
          const leftColumns = leafColumns.filter(column =>
            left?.includes(column.id)
          )
          const rightColumns = leafColumns.filter(column =>
            right?.includes(column.id)
          )
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
          key: 'getHeaderGroups',
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
          key: 'getCenterHeaderGroups',
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
          leafColumns = leafColumns.filter(column => left?.includes(column.id))
          return buildHeaderGroups(allColumns, leafColumns, instance, 'left')
        },
        {
          key: 'getLeftHeaderGroups',
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
          leafColumns = leafColumns.filter(column => right?.includes(column.id))
          return buildHeaderGroups(allColumns, leafColumns, instance, 'right')
        },
        {
          key: 'getRightHeaderGroups',
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
          key: 'getFooterGroups',
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
          key: 'getLeftFooterGroups',
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
          key: 'getCenterFooterGroups',
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
          key: 'getRightFooterGroups',
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
          key: 'getFlatHeaders',
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
          key: 'getLeftFlatHeaders',
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
          key: 'getCenterFlatHeaders',
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
          key: 'getRightFlatHeaders',
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
          key: 'getCenterLeafHeaders',
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
          key: 'getLeftLeafHeaders',
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
          key: 'getRightLeafHeaders',
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
          key: 'getLeafHeaders',
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

      getHeaderGroupProps: (id, userProps) => {
        const headerGroup = instance.getHeaderGroups().find(d => d.id === id)

        if (!headerGroup) {
          return
        }

        return propGetter(
          {
            key: headerGroup.id,
            role: 'row',
          },
          userProps
        )
      },

      getFooterGroupProps: (id, userProps) => {
        const headerGroup = instance.getFooterGroups().find(d => d.id === id)

        if (!headerGroup) {
          return
        }

        const initialProps = {
          key: headerGroup.id,
          role: 'row',
        }

        return propGetter(initialProps, userProps)
      },

      getHeaderProps: (id, userProps) => {
        const header = instance.getHeader(id)

        if (!header) {
          throw new Error()
        }

        const initialProps: HeaderProps = {
          key: header.id,
          role: 'columnheader',
          colSpan: header.colSpan,
          rowSpan: header.rowSpan,
        }

        return propGetter(initialProps, userProps)
      },

      getFooterProps: (id, userProps) => {
        const header = instance.getHeader(id)

        const initialProps: FooterProps = {
          key: header.id,
          role: 'columnfooter',
          colSpan: header.colSpan,
          rowSpan: header.rowSpan,
        }

        return propGetter(initialProps, userProps)
      },

      getTotalWidth: () => {
        let width = 0

        instance.getVisibleLeafColumns().forEach(column => {
          width += column.getWidth() ?? 0
        })

        return width
      },
    }
  },
}

export function buildHeaderGroups<TGenerics extends PartialGenerics>(
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
      getHeaderGroupProps: getterValue =>
        instance.getHeaderGroupProps(`${depth}`, getterValue)!,
      getFooterGroupProps: getterValue =>
        instance.getFooterGroupProps(`${depth}`, getterValue)!,
    }

    // The parent columns we're going to scan next
    const parentHeaders: Header<TGenerics>[] = []

    // Scan each column for parents
    headersToGroup.forEach(headerToGroup => {
      // What is the latest (last) parent column?

      const latestParentHeader = [...parentHeaders].reverse()[0]

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

      const header = instance.createHeader(column, {
        id: [headerFamily, depth, column.id, headerToGroup?.id]
          .filter(Boolean)
          .join('_'),
        isPlaceholder,
        placeholderId: isPlaceholder
          ? `${parentHeaders.filter(d => d.column === column).length}`
          : undefined,
        depth,
      })

      if (!latestParentHeader || latestParentHeader.column !== header.column) {
        header.subHeaders.push(headerToGroup)
        parentHeaders.push(header)
      } else {
        latestParentHeader.subHeaders.push(headerToGroup)
      }

      // if (!headerToGroup.isPlaceholder) {
      //   headerToGroup.column.header = headerToGroup;
      // }

      headerGroup.headers.push(headerToGroup)
    })

    headerGroups.push(headerGroup)

    if (depth > 0) {
      createHeaderGroup(parentHeaders, depth - 1)
    }
  }

  const bottomHeaders = columnsToGroup.map(column =>
    instance.createHeader(column, {
      depth: maxDepth,
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
