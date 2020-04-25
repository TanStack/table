import React from 'react'

import { expandRows, useGetLatest } from '../utils'

export default function useExpanded(instance) {
  const {
    rows,
    state: { expanded },
    options: { paginateExpandedRows },
  } = instance

  const getInstance = useGetLatest(instance)

  const expandedRows = React.useMemo(() => {
    if (expanded) {
      // This is here to trigger the change detection
    }
    if (paginateExpandedRows) {
      return expandRows(rows, getInstance)
    }
    return rows
  }, [expanded, getInstance, paginateExpandedRows, rows])

  Object.assign(instance, {
    preExpandedRows: rows,
    expandedRows,
    rows: expandedRows,
  })
}
