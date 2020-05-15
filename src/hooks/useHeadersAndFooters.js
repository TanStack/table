import React from 'react'

//

import {
  useGetLatest,
  flattenBy,
  buildHeaderGroups,
  recurseHeaderForSpans,
} from '../utils'

export default function useHeadersAndFooters(instance) {
  const {
    columns,
    leafColumns,
    plugs: {
      useReduceHeaderGroups,
      useReduceFooterGroups,
      useReduceFlatHeaders,
    },
  } = instance

  const getInstance = useGetLatest(instance)

  instance.headerGroups = React.useMemo(() => {
    if (process.env.NODE_ENV !== 'production' && getInstance().options.debug)
      console.info('Building Headers and Footers')

    return buildHeaderGroups(columns, leafColumns, { getInstance })
  }, [columns, getInstance, leafColumns])

  instance.headerGroups = useReduceHeaderGroups(instance.headerGroups, {
    getInstance,
  })

  instance.headerGroups[0].headers.forEach(header =>
    recurseHeaderForSpans(header)
  )

  instance.footerGroups = React.useMemo(
    () => [...instance.headerGroups].reverse(),
    [instance.headerGroups]
  )

  instance.footerGroups = useReduceFooterGroups(instance.footerGroups, {
    getInstance,
  })

  instance.flatHeaders = React.useMemo(
    () => flattenBy(instance.headerGroups, 'headers', true),
    [instance.headerGroups]
  )

  instance.flatHeaders = useReduceFlatHeaders(instance.flatHeaders, {
    getInstance,
  })

  instance.flatHeaders.forEach(header => {
    getInstance().plugs.decorateHeader(header, { getInstance })
  })

  instance.flatFooters = React.useMemo(
    () => flattenBy(instance.footerGroups, 'footers', true),
    [instance.footerGroups]
  )
}
