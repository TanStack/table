import React from 'react'
// import { composeDecorate } from 'react-table'

// export default options => {
//   return {
//     ...options,
//     decorateRow: React.useCallback(
//       composeDecorate(decorateRow, options.decorateRow),
//       [options]
//     ),
//     decorateCell: React.useCallback(
//       composeDecorate(decorateCell, options.decorateCell),
//       [options]
//     ),
//     decorateInstance: React.useCallback(
//       composeDecorate(decorateInstance, options.decoreateInstance),
//       [options]
//     ),
//   }
// }

function decorateRow(row, getInstance) {
  memoOn(row)(
    'Row',
    () => ({
      as = 'tr',
      children = row.cells.map(cell => <cell.Cell key={cell.id} />),
      ...rest
    }) => React.createElement(as, row.getRowProps(rest), children)
  )
}

function decorateCell(cell, getInstance) {
  memoOn(cell)(
    'Cell',
    () => ({ as = 'td', children = cell.render('Cell'), ...rest }) =>
      React.createElement(as, cell.getCellProps(rest), children)
  )
}

function decorateInstance(instance) {
  instance.flatHeaders.forEach((header, i) => {
    memoOn(header)(
      'Header',
      () => ({ as = 'th', children = header.render('Header'), ...rest }) =>
        React.createElement(as, header.getHeaderProps(rest), children)
    )

    memoOn(header)(
      'Footer',
      () => ({
        as = 'td',
        children = header.render(['Footer', 'Header']),
        ...rest
      }) => React.createElement(as, header.getFooterProps(rest), children)
    )

    memoOn(header)(
      'VisibilityToggle',
      () => ({
        as = props => <input type="checkbox" {...props} />,
        children,
        ...rest
      }) =>
        React.createElement(
          as,
          header.column.getToggleVisibilityProps(rest),
          children
        )
    )

    memoOn(header)(
      'GroupingToggle',
      () => ({ as = 'span', children, ...rest }) =>
        header.column.getCanGroup()
          ? React.createElement(
              as,
              header.column.getToggleGroupingProps(rest),
              children
            )
          : null
    )

    memoOn(header)(
      'SortingToggle',
      () => ({ as = 'span', children, ...rest }) =>
        header.column.getCanSort()
          ? React.createElement(
              as,
              header.column.getToggleSortingProps(rest),
              children
            )
          : children
    )
  })

  // Decorate HeadersGroups and FooterGroups
  instance.headerGroups.forEach((headerGroup, i) => {
    memoOn(headerGroup)(
      'HeaderGroup',
      () => ({
        as = 'tr',
        children = headerGroup.headers.map(header => (
          <header.Header key={header.id} />
        )),
        ...rest
      }) =>
        React.createElement(
          as,
          headerGroup.getHeaderGroupProps(rest),
          children
        ),
      [headerGroup]
    )

    memoOn(headerGroup)(
      'FooterGroup',
      () => ({
        as = 'tr',
        children = headerGroup.headers.map(header => (
          <header.Footer key={header.id} />
        )),
        ...rest
      }) =>
        React.createElement(as, headerGroup.getFooterGroupProps(rest), children)
    )
  })

  memoOn(instance)(
    'TableHead',
    () => ({
      as = 'thead',
      children = instance.headerGroups.map(headerGroup => (
        <headerGroup.HeaderGroup key={headerGroup.id} />
      )),
      ...rest
    }) => React.createElement(as, instance.getTableHeadProps(rest), children)
  )

  const firstFooterGroup = instance.footerGroups[0]

  memoOn(instance)(
    'TableFooter',
    () => ({
      as = 'tfoot',
      children = <firstFooterGroup.FooterGroup />,
      ...rest
    }) => React.createElement(as, instance.getTableFooterProps(rest), children),
    [firstFooterGroup]
  )

  memoOn(instance)(
    'TableBody',
    () => ({
      as = 'tbody',
      children = () => instance.rows.map((row, i) => <row.Row key={row.id} />),
      ...rest
    }) => React.createElement(as, instance.getTableBodyProps(rest), children)
  )

  memoOn(instance)('Table', () => ({ as = 'table', children = () => <>
        <instance.TableHead />
        <instance.TableBody />
      </>, ...rest }) =>
    React.createElement(as, instance.getTableProps(rest), children)
  )

  memoOn(instance)(
    'AllColumnsVisibilityToggle',
    () => ({
      as = props => <input type="checkbox" {...props} />,
      children,
      ...rest
    }) =>
      React.createElement(
        as,
        instance.getToggleAllColumnsVisibilityProps(rest),
        children
      )
  )
}

function memoOn(context) {
  context._memos = context._memos || {}

  return (key, value, deps = []) => {
    context._memos[key] = context._memos[key] || {}

    const memo = context._memos[key]

    if (
      !memo.lastDeps ||
      memo.lastDeps.length !== deps.length ||
      deps.some((dep, i) => memo.lastDeps[i] !== dep)
    ) {
      memo.lastDeps = deps
      memo.value = value()
    }

    context[key] = memo.value
  }
}
