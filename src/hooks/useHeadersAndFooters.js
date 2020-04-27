import React from 'react'

//

import { useGetLatest, makeRenderer, getLeafHeaders } from '../utils'

export default function useHeadersAndFooters(instance) {
  const { columns, visibleColumns } = instance
  const getInstance = useGetLatest(instance)

  instance.headerGroups = React.useMemo(() => {
    if (process.env.NODE_ENV !== 'production' && getInstance().options.debug)
      console.info('Building Headers and Footers')
    // Find the max depth of the columns:
    // build the leaf column row
    // build each buffer row going up
    //    placeholder for non-existent level
    //    real column for existing level

    let maxDepth = 0

    const findMaxDepth = (columns, depth = 0) => {
      columns.forEach(column => {
        if (!column.getIsVisible?.()) {
          return
        }
        if (column.columns) {
          findMaxDepth(column.columns, depth + 1)
        }

        maxDepth = Math.max(maxDepth, depth)
      }, 0)
    }

    findMaxDepth(columns)

    const headerGroups = []

    const makeHeaderGroup = (headers, depth) => {
      // The header group we are creating
      const headerGroup = {
        depth,
        id: depth,
        headers: [],
      }

      // The parent columns we're going to scan next
      const parentHeaders = []

      // Scan each column for parents
      headers.forEach(header => {
        // What is the latest (last) parent column?
        let latestParentHeader = [...parentHeaders].reverse()[0]

        let parentHeader = {
          subHeaders: [],
        }

        const isTrueHeaderDepth = header.column.depth === headerGroup.depth

        if (isTrueHeaderDepth && header.column.parent) {
          // The parent header different
          parentHeader.isPlaceholder = false
          parentHeader.column = header.column.parent
        } else {
          // The parent header is repeated
          parentHeader.column = header.column
          parentHeader.isPlaceholder = true
        }

        parentHeader.placeholderId = parentHeaders.filter(
          d => d.column === parentHeader.column
        ).length

        if (
          !latestParentHeader ||
          latestParentHeader.column !== parentHeader.column
        ) {
          parentHeader.subHeaders.push(header)
          parentHeaders.push(parentHeader)
        } else {
          latestParentHeader.subHeaders.push(header)
        }

        if (!header.isPlaceholder) {
          header.column.header = header
        }

        header.id = [header.column.id, header.placeholderId]
          .filter(Boolean)
          .join('_')

        headerGroup.headers.push(header)
      })

      headerGroups.push(headerGroup)

      if (depth > 0) {
        makeHeaderGroup(parentHeaders, depth - 1)
      }
    }

    const bottomHeaders = visibleColumns.map(column => ({
      column,
      isPlaceholder: false,
    }))

    makeHeaderGroup(bottomHeaders, maxDepth)

    headerGroups.reverse()

    headerGroups.forEach(headerGroup => {
      headerGroup.getHeaderGroupProps = (props = {}) => ({
        role: 'row',
        ...props,
      })

      headerGroup.getFooterGroupProps = (props = {}) => ({
        role: 'row',
        ...props,
      })
    })

    return headerGroups
  }, [columns, getInstance, visibleColumns])

  instance.footerGroups = React.useMemo(
    () => [...instance.headerGroups].reverse(),
    [instance.headerGroups]
  )

  const recurseHeaderForSpans = header => {
    let colSpan = 0
    let rowSpan = 1
    let childRowSpans = [0]

    if (header.column.getIsVisible()) {
      if (header.subHeaders && header.subHeaders.length) {
        childRowSpans = []
        header.subHeaders.forEach(subHeader => {
          const [count, childRowSpan] = recurseHeaderForSpans(subHeader)
          colSpan += count
          childRowSpans.push(childRowSpan)
        })
      } else {
        colSpan = header.column.getIsVisible() ? 1 : 0
      }
    }

    let minChildRowSpan = Math.min(...childRowSpans)
    rowSpan = rowSpan + minChildRowSpan

    header.colSpan = colSpan
    header.rowSpan = rowSpan

    return [colSpan, rowSpan]
  }

  instance.headerGroups[0].headers.forEach(header =>
    recurseHeaderForSpans(header)
  )

  instance.flatHeaders = React.useMemo(
    () =>
      instance.headerGroups
        .reduce((all, headerGroup) => [...all, ...headerGroup.headers], [])
        .map(header => {
          header.render = header.isPlaceholder
            ? () => null
            : makeRenderer(getInstance, header.column, {
                column: header.column,
              })

          // Give columns/headers a default getHeaderProps
          header.getHeaderProps = (props = {}) => ({
            role: 'columnheader',
            colSpan: header.colSpan,
            style: {
              position: 'relative',
            },
            ...props,
          })

          // Give columns/headers a default getFooterProps
          header.getFooterProps = (props = {}) => ({
            colSpan: header.colSpan,
            style: {
              position: 'relative',
            },
            ...props,
          })

          header.getCanResize = () =>
            getInstance().getColumnCanResize(header.column.id)

          header.getWidth = () => getInstance().getColumnWidth(header.column.id)
          header.getIsResizing = () =>
            getInstance().getColumnIsResizing(header.column.id)

          header.getResizerProps = (props = {}) => {
            const onResizeStart = (e, header) => {
              let isTouchEvent = false
              if (e.type === 'touchstart') {
                // lets not respond to multiple touches (e.g. 2 or 3 fingers)
                if (e.touches && e.touches.length > 1) {
                  return
                }
                isTouchEvent = true
              }
              const headersToResize = getLeafHeaders(header)
              const headerIdWidths = headersToResize.map(d => [
                d.id,
                d.totalWidth,
              ])

              const clientX = isTouchEvent
                ? Math.round(e.touches[0].clientX)
                : e.clientX

              const onMove = clientXPos =>
                getInstance().setState(
                  old => {
                    const {
                      startX,
                      columnWidth,
                      headerIdWidths,
                    } = old.columnResizing

                    const deltaX = clientXPos - startX
                    const percentageDeltaX = deltaX / columnWidth

                    const newColumnWidths = {}

                    headerIdWidths.forEach(([headerId, headerWidth]) => {
                      newColumnWidths[headerId] = Math.max(
                        headerWidth + headerWidth * percentageDeltaX,
                        0
                      )
                    })

                    return {
                      ...old,
                      columnResizing: {
                        ...old.columnResizing,
                        columnWidths: {
                          ...old.columnResizing.columnWidths,
                          ...newColumnWidths,
                        },
                      },
                    }
                  },
                  {
                    type: 'resizeColumnMove',
                  }
                )

              const onEnd = () =>
                getInstance().setState(
                  old => ({
                    ...old,
                    columnResizing: {
                      ...old.columnResizing,
                      startX: null,
                      isResizingColumn: null,
                    },
                  }),
                  {
                    type: 'resizeColumnEnd',
                  }
                )

              const handlersAndEvents = {
                mouse: {
                  moveEvent: 'mousemove',
                  moveHandler: e => onMove(e.clientX),
                  upEvent: 'mouseup',
                  upHandler: e => {
                    document.removeEventListener(
                      'mousemove',
                      handlersAndEvents.mouse.moveHandler
                    )
                    document.removeEventListener(
                      'mouseup',
                      handlersAndEvents.mouse.upHandler
                    )
                    onEnd()
                  },
                },
                touch: {
                  moveEvent: 'touchmove',
                  moveHandler: e => {
                    if (e.cancelable) {
                      e.preventDefault()
                      e.stopPropagation()
                    }
                    onMove(e.touches[0].clientX)
                    return false
                  },
                  upEvent: 'touchend',
                  upHandler: e => {
                    document.removeEventListener(
                      handlersAndEvents.touch.moveEvent,
                      handlersAndEvents.touch.moveHandler
                    )
                    document.removeEventListener(
                      handlersAndEvents.touch.upEvent,
                      handlersAndEvents.touch.moveHandler
                    )
                    onEnd()
                  },
                },
              }

              const events = isTouchEvent
                ? handlersAndEvents.touch
                : handlersAndEvents.mouse

              document.addEventListener(events.moveEvent, events.moveHandler, {
                passive: false,
              })

              document.addEventListener(events.upEvent, events.upHandler, {
                passive: false,
              })

              getInstance().setState(
                old => ({
                  ...old,
                  columnResizing: {
                    ...old.columnResizing,
                    startX: clientX,
                    headerIdWidths,
                    columnWidth: header.totalWidth,
                    isResizingColumn: header.id,
                  },
                }),
                {
                  type: 'resizeColumnStart',
                }
              )
            }

            return [
              props,
              {
                onMouseDown: e => e.persist() || onResizeStart(e, header),
                onTouchStart: e => e.persist() || onResizeStart(e, header),
                style: {
                  cursor: 'ew-resize',
                },
                draggable: false,
                role: 'separator',
              },
            ]
          }

          return header
        }),
    [getInstance, instance.headerGroups]
  )

  instance.flatFooters = React.useMemo(
    () =>
      instance.footerGroups.reduce(
        (all, footerGroup) => [...all, ...footerGroup.footers],
        []
      ),
    [instance.footerGroups]
  )

  const { getColumnIsVisible } = instance

  instance.getIsAllColumnsVisible = React.useCallback(
    () => !instance.flatColumns.some(column => !getColumnIsVisible(column.id)),
    [getColumnIsVisible, instance.flatColumns]
  )

  instance.getIsSomeColumnsVisible = React.useCallback(
    () => instance.flatColumns.some(column => getColumnIsVisible(column.id)),
    [getColumnIsVisible, instance.flatColumns]
  )
}
