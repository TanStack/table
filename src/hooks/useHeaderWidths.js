import React from 'react'

//

import { useGetLatest } from '../utils'

export default function useHeaderWidths(instance) {
  const getInstance = useGetLatest(instance)

  React.useMemo(() => {
    if (getInstance().options.debug) console.info('Getting Header Widths...')

    let sumTotalMinWidth = 0
    let sumTotalWidth = 0
    let sumTotalMaxWidth = 0
    let sumTotalFlexWidth = 0

    calculateHeaderWidths(instance.headerGroups[0].headers)

    Object.assign(getInstance(), {
      sumTotalMinWidth,
      sumTotalWidth,
      sumTotalMaxWidth,
      sumTotalFlexWidth,
    })

    function calculateHeaderWidths(headers, left = 0) {
      headers.forEach(header => {
        let { headers: subHeaders } = header

        header.totalLeft = left

        if (subHeaders && subHeaders.length) {
          const [
            totalMinWidth,
            totalWidth,
            totalMaxWidth,
            totalFlexWidth,
          ] = calculateHeaderWidths(subHeaders, left)
          header.totalMinWidth = totalMinWidth
          header.totalWidth = totalWidth
          header.totalMaxWidth = totalMaxWidth
          header.totalFlexWidth = totalFlexWidth
        } else {
          header.totalMinWidth = header.minWidth
          header.totalWidth = Math.min(
            Math.max(header.minWidth, header.width),
            header.maxWidth
          )
          header.totalMaxWidth = header.maxWidth
          header.totalFlexWidth = header.canResize ? header.totalWidth : 0
        }

        if (header.column.getIsVisible()) {
          left += header.totalWidth
          sumTotalMinWidth += header.totalMinWidth
          sumTotalWidth += header.totalWidth
          sumTotalMaxWidth += header.totalMaxWidth
          sumTotalFlexWidth += header.totalFlexWidth
        }
      })
    }
  }, [getInstance, instance.headerGroups])
}
