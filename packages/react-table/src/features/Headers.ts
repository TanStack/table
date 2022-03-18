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
  PropGetterValue,
  ReactTable,
  Row,
} from '../types'
import { propGetter, memo, flexRender } from '../utils'

import * as ColumnSizing from './ColumnSizing'

export type HeadersRow<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
> = {
  _getAllVisibleCells: () => Cell<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getVisibleCells: () => Cell<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getLeftVisibleCells: () => Cell<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getCenterVisibleCells: () => Cell<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getRightVisibleCells: () => Cell<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
}

export type HeadersInstance<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
> = {
  createHeader: (
    column: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
    options: {
      id?: string
      isPlaceholder?: boolean
      placeholderId?: string
      depth: number
    }
  ) => Header<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  getHeaderGroups: () => HeaderGroup<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getLeftHeaderGroups: () => HeaderGroup<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getCenterHeaderGroups: () => HeaderGroup<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getRightHeaderGroups: () => HeaderGroup<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]

  getFooterGroups: () => HeaderGroup<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getCenterFooterGroups: () => HeaderGroup<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getLeftFooterGroups: () => HeaderGroup<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getRightFooterGroups: () => HeaderGroup<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]

  getFlatHeaders: () => Header<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getLeftFlatHeaders: () => Header<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getCenterFlatHeaders: () => Header<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getRightFlatHeaders: () => Header<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]

  getLeafHeaders: () => Header<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getLeftLeafHeaders: () => Header<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getCenterLeafHeaders: () => Header<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getRightLeafHeaders: () => Header<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]

  getHeader: (
    id: string
  ) => Header<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>

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

export function createRow<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  row: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
): HeadersRow<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> {
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
      'row._getAllVisibleCells',
      instance.options.debug
    ),
    getVisibleCells: memo(
      () => [
        row.getLeftVisibleCells(),
        row.getCenterVisibleCells(),
        row.getRightVisibleCells(),
      ],
      (left, center, right) => [...left, ...center, ...right],
      'row.getVisibleCells',
      instance.options.debug
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
      'row.getCenterVisibleCells',
      instance.options.debug
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
      'row.getLeftVisibleCells',
      instance.options.debug
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
      'row.getRightVisibleCells',
      instance.options.debug
    ),
  }
}

export function getInstance<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
): HeadersInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> {
  return {
    createHeader: (
      column: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
      options: {
        id?: string
        isPlaceholder?: boolean
        placeholderId?: string
        depth: number
      }
    ) => {
      const id = options.id ?? column.id

      let header: CoreHeader<
        TData,
        TValue,
        TFilterFns,
        TSortingFns,
        TAggregationFns
      > = {
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

          const recurse = (
            header: CoreHeader<
              TData,
              TValue,
              TFilterFns,
              TSortingFns,
              TAggregationFns
            >
          ) => {
            if (header.subHeaders.length) {
              header.subHeaders.forEach(recurse)
            } else {
              sum += header.column.getWidth() ?? 0
            }
          }

          recurse(header)

          return sum
        },
        getLeafHeaders: (): Header<
          TData,
          TValue,
          TFilterFns,
          TSortingFns,
          TAggregationFns
        >[] => {
          const leafHeaders: CoreHeader<
            TData,
            TValue,
            TFilterFns,
            TSortingFns,
            TAggregationFns
          >[] = []

          const recurseHeader = (
            h: CoreHeader<
              TData,
              TValue,
              TFilterFns,
              TSortingFns,
              TAggregationFns
            >
          ) => {
            if (h.subHeaders && h.subHeaders.length) {
              h.subHeaders.map(recurseHeader)
            }
            leafHeaders.push(h)
          }

          recurseHeader(header)

          return leafHeaders as Header<
            TData,
            TValue,
            TFilterFns,
            TSortingFns,
            TAggregationFns
          >[]
        },
        getHeaderProps: userProps =>
          instance.getHeaderProps(header.id, userProps)!,
        getFooterProps: userProps =>
          instance.getFooterProps(header.id, userProps)!,
        renderHeader: () => flexRender(column.header, { header, column }),
        renderFooter: () => flexRender(column.footer, { header, column }),
      }

      header = Object.assign(
        header,
        ColumnSizing.createHeader(
          header as Header<
            TData,
            TValue,
            TFilterFns,
            TSortingFns,
            TAggregationFns
          >,
          instance
        )
      )

      // Yes, we have to convert instance to uknown, because we know more than the compiler here.
      return header as Header<
        TData,
        TValue,
        TFilterFns,
        TSortingFns,
        TAggregationFns
      >
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
      'getHeaderGroups',
      instance.options.debug
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
      'getCenterHeaderGroups',
      instance.options.debug
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
      'getLeftHeaderGroups',
      instance.options.debug
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
      'getRightHeaderGroups',
      instance.options.debug
    ),

    // Footer Groups

    getFooterGroups: memo(
      () => [instance.getHeaderGroups()],
      headerGroups => {
        return [...headerGroups].reverse()
      },
      'getFooterGroups',
      instance.options.debug
    ),

    getLeftFooterGroups: memo(
      () => [instance.getLeftHeaderGroups()],
      headerGroups => {
        return [...headerGroups].reverse()
      },
      'getLeftFooterGroups',
      instance.options.debug
    ),

    getCenterFooterGroups: memo(
      () => [instance.getCenterHeaderGroups()],
      headerGroups => {
        return [...headerGroups].reverse()
      },
      'getCenterFooterGroups',
      instance.options.debug
    ),

    getRightFooterGroups: memo(
      () => [instance.getRightHeaderGroups()],
      headerGroups => {
        return [...headerGroups].reverse()
      },
      'getRightFooterGroups',
      instance.options.debug
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
      'getFlatHeaders',
      instance.options.debug
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
      'getLeftFlatHeaders',
      instance.options.debug
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
      'getCenterFlatHeaders',
      instance.options.debug
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
      'getRightFlatHeaders',
      instance.options.debug
    ),

    // Leaf Headers

    getCenterLeafHeaders: memo(
      () => [instance.getCenterFlatHeaders()],
      flatHeaders => {
        return flatHeaders.filter(header => !header.subHeaders?.length)
      },
      'getCenterLeafHeaders',
      instance.options.debug
    ),

    getLeftLeafHeaders: memo(
      () => [instance.getLeftFlatHeaders()],
      flatHeaders => {
        return flatHeaders.filter(header => !header.subHeaders?.length)
      },
      'getLeftLeafHeaders',
      instance.options.debug
    ),

    getRightLeafHeaders: memo(
      () => [instance.getRightFlatHeaders()],
      flatHeaders => {
        return flatHeaders.filter(header => !header.subHeaders?.length)
      },
      'getRightLeafHeaders',
      instance.options.debug
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
      'getLeafHeaders',
      instance.options.debug
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
      if (!header) {
        return
      }

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
}

export function buildHeaderGroups<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  allColumns: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[],
  columnsToGroup: Column<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[],
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  headerFamily?: 'center' | 'left' | 'right'
) {
  // Find the max depth of the columns:
  // build the leaf column row
  // build each buffer row going up
  //    placeholder for non-existent level
  //    real column for existing level

  let maxDepth = 0

  const findMaxDepth = (
    columns: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[],
    depth = 1
  ) => {
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

  let headerGroups: HeaderGroup<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[] = []

  const createHeaderGroup = (
    headersToGroup: Header<
      TData,
      TValue,
      TFilterFns,
      TSortingFns,
      TAggregationFns
    >[],
    depth: number
  ) => {
    // The header group we are creating
    const headerGroup: HeaderGroup<
      TData,
      TValue,
      TFilterFns,
      TSortingFns,
      TAggregationFns
    > = {
      depth,
      id: [headerFamily, `${depth}`].filter(Boolean).join('_'),
      headers: [],
      getHeaderGroupProps: getterValue =>
        instance.getHeaderGroupProps(`${depth}`, getterValue)!,
      getFooterGroupProps: getterValue =>
        instance.getFooterGroupProps(`${depth}`, getterValue)!,
    }

    // The parent columns we're going to scan next
    const parentHeaders: Header<
      TData,
      TValue,
      TFilterFns,
      TSortingFns,
      TAggregationFns
    >[] = []

    // Scan each column for parents
    headersToGroup.forEach(headerToGroup => {
      // What is the latest (last) parent column?

      const latestParentHeader = [...parentHeaders].reverse()[0]

      const isLeafHeader = headerToGroup.column.depth === headerGroup.depth

      let column: Column<
        TData,
        TValue,
        TFilterFns,
        TSortingFns,
        TAggregationFns
      >
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

  const recurseHeadersForSpans = (
    headers: Header<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[]
  ) => {
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
