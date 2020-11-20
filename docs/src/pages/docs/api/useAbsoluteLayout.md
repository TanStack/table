# `useAbsoluteLayout`

- Plugin Hook
- Optional

`useAbsoluteLayout` is a plugin hook that adds support for headers and cells to be rendered as absolutely positioned `div`s (or other non-table elements) with explicit `width`. Similar to the `useBlockLayout` hook, this becomes useful if and when you need to virtualize rows and cells for performance.

**NOTE:** Although no additional options are needed for this plugin to work, the core column options `width`, `minWidth` and `maxWidth` are used to calculate column and cell widths and must be set. [See Column Options](./useTable#column-options) for more information on these options.

### Instance Properties

- `getTableBodyProps`
  - **Usage Required**
  - This core prop getter is required to to enable absolute layout for the table body

### Row Properties

- `getRowProps`
  - **Usage Required**
  - This core prop getter is required to to enable absolute layout for rows

### Cell Properties

- `getCellProps`
  - **Usage Required**
  - This core prop getter is required to to enable absolute layout for rows cells

### HeaderGroup Properties

- `getHeaderGroupProps`
  - **Usage Required**
  - This core prop getter is required to to enable absolute layout for headers

### Header Properties

- `getHeaderProps`
  - **Usage Required**
  - This core prop getter is required to to enable absolute layout for headers

### FooterGroup Properties

- `getFooterGroupProps`
  - **Usage Required**
  - This core prop getter is required to to enable absolute layout for footers

### Footer Properties

- `getFooterProps`
  - **Usage Required**
  - This core prop getter is required to to enable absolute layout for footers

### Example

- [Source](https://github.com/tannerlinsley/react-table/tree/master/examples/absolute-layout)
- [Open in CodeSandbox](https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/absolute-layout)
