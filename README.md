# TanStack React Table v8 (alpha)

> [Looking for v7?](https://github.com/tanstack/react-table/tree/v7)

This is an **alpha** version of React Table v8. It is not ready for production use, but it is ready to be taste-tested!

## Notable Changes

- Full rewrite to TypeScript
- Removal of plugin system
- Much more inversion of control
- More stable and feature complete API
- Better controlled state management
- Better support for server-side operations

## Migration

Currently migration will involve rewrites to:

- Any table logic and API surrounding the `useTable` hook
- Any custom plugins must be rewritten to wrap/compose the new `useTable` hook
- Table markup API must be rewritten to use the new API. Don't worry, this is not as big of a deal as it sounds :)

## Todo (in order of priority)

- [] Rewrite Core
  - [x] Core
  - [x] Columns
  - [x] Headers
  - [x] Visibility
  - [x] Pinning
  - [x] Filters
  - [x] Sorting
  - [x] Grouping
  - [x] Expanding
  - [] Column Resizing
  - [] Pagination
  - [] Row Selection
- [] Migrate [Examples](https://github.com/tanstack/react-table/tree/alpha/examples)
  - [x] column-visibility
  - [x] column-ordering
  - [x] column-pinning
  - [x] basic
  - [x] filters
  - [x] sorting
  - [] grouping-and-aggregation
  - [] pagination
  - [] column-resizing
  - [] editable-data
  - [] pagination-controlled
  - [] kitchen-sink
  - [] kitchen-sink-controlled
  - [] row-dnd
  - [] streaming-rows
  - [] sub-components
  - [] virtualized-rows
  - [] absolute-layout
  - [] block-layout
  - [] animated-framer-motion
  - [] bootstrap
  - [] bootstrap-ui-components
  - [] data-driven-classes-and-styles
  - [] full-width-resizable-table
  - [] full-width-table
  - [] material-ui-components
  - [] material-UI-enhanced-table
- [] [Documentation](https://react-table-v8.tanstack.com/)
  - [] API
    - [] Core
    - [] Columns
    - [] Headers
    - [] Visibility
    - [] Pinning
    - [] Filters
    - [] Sorting
    - [] Grouping
    - [] Expanding
    - [] Column Resizing
    - [] Pagination
    - [] Row Selection
  - [] Guides
    - [] Core
    - [] Columns
    - [] Headers
    - [] Visibility
    - [] Pinning
    - [] Filters
    - [] Sorting
    - [] Grouping
    - [] Expanding
    - [] Column Resizing
    - [] Pagination
    - [] Row Selection

## Installation

```bash
npm install @tanstack/react-table@alpha
# or
yarn add @tanstack/react-table@alpha
```

<!-- Force 2 -->
