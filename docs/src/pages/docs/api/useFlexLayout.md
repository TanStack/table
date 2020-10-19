# `useFlexLayout`

- Plugin Hook
- Optional

`useFlexLayout` is a plugin hook that adds support for headers and cells to be rendered as `inline-block` `div`s (or other non-table elements) with `width` being used as the flex-basis and flex-grow. This hook becomes useful when implementing both virtualized and resizable tables that must also be able to stretch to fill all available space.

**NOTE:** Although no additional options are needed for this plugin to work, the core column options `width`, `minWidth` and `maxWidth` are used to calculate column and cell widths and must be set:

- `minWidth` is only used to limit column resizing. It does not define the minimum width for a column.
- `width` is used as both the `flex-basis` and `flex-grow`. This means that it essentially acts as both the minimum width and flex-ratio of the column.
- `maxWidth` is only used to limit column resizing. It does not define the maximum width for a column.

[See Column Options](./useTable#column-options) for more information on these options.

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

### Example (Full Width Resizable Table)

- [Source](https://github.com/tannerlinsley/react-table/tree/master/examples/full-width-resizable-table)
- [Open in CodeSandbox](https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/full-width-resizable-table)
