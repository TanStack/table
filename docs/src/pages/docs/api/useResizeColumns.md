# `useResizeColumns`

- Plugin Hook
- Optional

`useResizeColumns` is a plugin hook that adds support for resizing headers and cells when using non-table elements for layout eg. the `useBlockLayout`, `useAbsoluteLayout`, and `useGridLayout` hooks. It even supports resizing column groups!

### Table Options

- `disableResizing: Bool`

  - Defaults to `false`
  - When set to `true`, resizing is disabled across the entire table

- `reverseResizer: Bool`
  - Defaults to `undefined`
  - When set to `true`,use it for rtl layout. resizing will be reversed witch means by moving resizer to right the column width will be decreases in ltr layouts.

### Column Options

The core column options `width`, `minWidth` and `maxWidth` are used to calculate column and cell widths and must be set. [See Column Options](./useTable#column-options) for more information on these options.

- `disableResizing: Bool`
  - Defaults to `false`
  - When set to `true`, resizing is disabled for this column

### Header Properties

- `getResizerProps`
  - **Usage Required**
  - This core prop getter is required to to enable absolute layout for headers
- `canResize: Bool`
  - Will be `true` if this column can be resized
- `isResizing: Bool`
  - Will be `true` if this column is currently being resized

### Example

- [Source](https://github.com/tannerlinsley/react-table/tree/master/examples/column-resizing)
- [Open in CodeSandbox](https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/column-resizing)
