import React from 'react'

export const Row = ({
  as = 'tr',
  row,
  children = row.cells.map(cell => <cell.Cell key={cell.id} />),
  ...rest
}) => React.createElement(as, row.getRowProps(rest), children)

export const Cell = ({
  as = 'td',
  cell,
  children = cell.render('Cell'),
  ...rest
}) => React.createElement(as, cell.getCellProps(rest), children)

export const Header = ({
  as = 'th',
  header,
  children = header.render('Header'),
  ...rest
}) => React.createElement(as, header.getHeaderProps(rest), children)

export const HeaderContent = ({ header, ...rest }) =>
  header.render('Header', rest)

export const Footer = ({
  as = 'td',
  footer,
  children = footer.render(['Footer', 'Header']),
  ...rest
}) => React.createElement(as, footer.getFooterProps(rest), children)

export const VisibilityToggle = ({
  as = props => <input type="checkbox" {...props} />,
  column,
  children,
  ...rest
}) => React.createElement(as, column.getToggleVisibilityProps(rest), children)

export const GroupingToggle = ({ as = 'span', column, children, ...rest }) =>
  column.getCanGroup()
    ? React.createElement(as, column.getToggleGroupingProps(rest), children)
    : null

export const SortingToggle = ({ as = 'span', column, children, ...rest }) =>
  column.getCanSort()
    ? React.createElement(as, column.getToggleSortingProps(rest), children)
    : children

export const HeaderGroup = ({
  as = 'tr',
  headerGroup,
  children = headerGroup.headers.map(header => (
    <header.Header key={header.id} />
  )),
  ...rest
}) => React.createElement(as, headerGroup.getHeaderGroupProps(rest), children)

export const FooterGroup = ({
  as = 'tr',
  footerGroup,
  children = footerGroup.headers.map(header => (
    <header.Footer key={header.id} />
  )),
  ...rest
}) => React.createElement(as, footerGroup.getFooterGroupProps(rest), children)

export const TableHead = ({
  as = 'thead',
  instance,
  children = instance.headerGroups.map(headerGroup => (
    <headerGroup.HeaderGroup key={headerGroup.id} />
  )),
  ...rest
}) => React.createElement(as, instance.getTableHeadProps(rest), children)

export const TableFooter = ({
  as = 'tfoot',
  firstFooterGroup,
  instance,
  children = <firstFooterGroup.FooterGroup />,
  ...rest
}) => React.createElement(as, instance.getTableFooterProps(rest), children)

export const TableBody = ({
  as = 'tbody',
  instance,
  children = () => instance.rows.map((row, i) => <row.Row key={row.id} />),
  ...rest
}) => React.createElement(as, instance.getTableBodyProps(rest), children)

export const Table = ({
  as = 'table',
  instance,
  children = () => (
    <>
      <TableHead />
      <TableBody />
    </>
  ),
  ...rest
}) => React.createElement(as, instance.getTableProps(rest), children)

export const AllColumnsVisibilityToggle = ({
  as = props => <input type="checkbox" {...props} />,
  instance,
  children,
  ...rest
}) =>
  React.createElement(
    as,
    instance.getToggleAllColumnsVisibilityProps(rest),
    children
  )
