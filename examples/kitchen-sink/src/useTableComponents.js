import React from 'react'
// import { compose } from 'react-table'

const compose = (...fns) => {
  return (...args) => {
    fns.filter(Boolean).forEach(fn => fn(...args))
  }
}

export default options => {
  return {
    ...options,
    decorateRow: React.useMemo(
      () => compose(decorateRow, options.decorateRow),
      [options.decorateRow]
    ),
    decorateCell: React.useMemo(
      () => compose(decorateCell, options.decorateCell),
      [options.decorateCell]
    ),
    decorateInstance: React.useMemo(
      () => compose(decorateInstance, options.decoreateInstance),
      [options.decoreateInstance]
    ),
  }
}

function decorateRow(row, getInstance) {
  row.Row = assignMemo(
    row,
    'Row',
    () => ({
      as = 'tr',
      children = row.cells.map(cell => <cell.Cell key={cell.id} />),
      ...rest
    }) => React.createElement(as, row.getRowProps(rest), children)
  )
}

function decorateCell(cell, getInstance) {
  cell.Cell = assignMemo(
    cell,
    'Cell',
    () => ({ as = 'td', children = cell.render('Cell'), ...rest }) =>
      React.createElement(as, cell.getCellProps(rest), children)
  )
}

function decorateInstance(instance) {
  instance.flatHeaders.forEach((header, i) => {
    header.Header = assignMemo(
      header,
      'Header',
      () => ({ as = 'th', children = header.render('Header'), ...rest }) =>
        React.createElement(as, header.getHeaderProps(rest), children)
    )

    header.Footer = assignMemo(
      header,
      'Footer',
      () => ({
        as = 'td',
        children = header.render(['Footer', 'Header']),
        ...rest
      }) => React.createElement(as, header.getFooterProps(rest), children)
    )

    header.column.VisibilityToggle = assignMemo(
      header,
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

    header.column.GroupingToggle = assignMemo(
      header,
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

    header.column.SortingToggle = assignMemo(
      header,
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
    headerGroup.HeaderGroup = assignMemo(
      headerGroup,
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

    headerGroup.FooterGroup = assignMemo(
      headerGroup,
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

  instance.TableHead = assignMemo(
    instance,
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

  instance.TableFooter = assignMemo(
    instance,
    'TableFooter',
    () => ({
      as = 'tfoot',
      children = <firstFooterGroup.FooterGroup />,
      ...rest
    }) => React.createElement(as, instance.getTableFooterProps(rest), children),
    [firstFooterGroup]
  )

  instance.TableBody = assignMemo(
    instance,
    'TableBody',
    () => ({
      as = 'tbody',
      children = () => instance.rows.map((row, i) => <row.Row key={row.id} />),
      ...rest
    }) => React.createElement(as, instance.getTableBodyProps(rest), children)
  )

  instance.Table = assignMemo(
    instance,
    'Table',
    () => ({
      as = 'table',
      children = () => (
        <>
          <instance.TableHead />
          <instance.TableBody />
        </>
      ),
      ...rest
    }) => React.createElement(as, instance.getTableProps(rest), children)
  )

  instance.AllColumnsVisibilityToggle = assignMemo(
    instance,
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

function assignMemo(obj, key, value, deps = []) {
  obj._memos = obj._memos || {}
  obj._memos[key] = obj._memos[key] || {}

  const memo = obj._memos[key]

  if (
    !memo.lastDeps ||
    memo.lastDeps.length !== deps.length ||
    deps.some((dep, i) => memo.lastDeps[i] !== dep)
  ) {
    memo.lastDeps = deps
    memo.value = value()
  }

  return memo.value
}
