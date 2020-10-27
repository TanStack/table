import React from 'react'

//

import { flattenBy, buildHeaderGroups, recurseHeaderForSpans } from '../utils'

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

  instance.headerGroups = React.useMemo(() => {
    if (process.env.NODE_ENV !== 'production' && instance.options.debug)
      console.info('Building Headers and Footers')

    return buildHeaderGroups(columns, leafColumns, { instance })
  }, [columns, instance, leafColumns])

  instance.headerGroups = useReduceHeaderGroups(instance.headerGroups, {
    instance,
  })

  instance.headerGroups[0].headers.forEach(header =>
    recurseHeaderForSpans(header)
  )

  instance.footerGroups = React.useMemo(
    () => [...instance.headerGroups].reverse(),
    [instance.headerGroups]
  )

  instance.footerGroups = useReduceFooterGroups(instance.footerGroups, {
    instance,
  })

  instance.flatHeaders = React.useMemo(
    () => flattenBy(instance.headerGroups, 'headers', true),
    [instance.headerGroups]
  )

  instance.flatHeaders = useReduceFlatHeaders(instance.flatHeaders, {
    instance,
  })

  instance.flatHeaders.forEach(header => {
    instance.plugs.decorateHeader(header, { instance })
  })

  instance.flatFooters = React.useMemo(
    () => flattenBy(instance.footerGroups, 'footers', true),
    [instance.footerGroups]
  )
}
