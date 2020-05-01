import React from 'react'

//

import { useGetLatest, makeRenderer } from '../utils'

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
      headerGroup.getHeaderGroupProps = (props = {}) =>
        getInstance().plugs.reduceHeaderGroupProps(
          {
            role: 'row',
            ...props,
          },
          { getInstance, headerGroup }
        )

      headerGroup.getFooterGroupProps = (props = {}) =>
        getInstance().plugs.reduceFooterGroupProps(
          {
            role: 'row',
            ...props,
          },
          { getInstance, headerGroup }
        )
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
            : makeRenderer(getInstance, {
                column: header.column,
              })

          // Give columns/headers a default getHeaderProps
          header.getHeaderProps = (props = {}) =>
            getInstance().plugs.reduceHeaderProps(
              {
                role: 'columnheader',
                ...props,
              },
              { getInstance, header }
            )

          // Give columns/headers a default getFooterProps
          header.getFooterProps = (props = {}) =>
            getInstance().plugs.reduceFooterProps(
              {
                role: 'columnfooter',
                ...props,
              },
              {
                getInstance,
                header,
              }
            )

          header.getWidth = () => getInstance().getColumnWidth(header.column.id)

          getInstance().plugs.decorateHeader(header, { getInstance })

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
