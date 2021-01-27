---
id: overview
title: Overview
---

# API Overview

React Table uses React Hooks both internally and externally for almost all of its configuration and lifecycle management. Naturally, this is what allows React Table to be headless and lightweight while still having a concise and simple API.

React Table is essentially a compatible collection of **custom React hooks**:

- The primary React Table hook
  - `useTable`
- Plugin Hooks
  - Core Plugin Hooks
    - `useTable`
    - `useFilters`
    - `useGlobalFilter`
    - `useSortBy`
    - `useGroupBy`
    - `useExpanded`
    - `usePagination`
    - `useRowSelect`
    - `useRowState`
    - `useColumnOrder`
    - `useResizeColumns`
  - Layout Hooks
    - `useBlockLayout`
    - `useAbsoluteLayout`
    - `useFlexLayout`
- 3rd Party Plugin Hooks
  - [LineUp-lite Hooks](https://lineup-lite.netlify.app)
    - Core Plugin Hooks
      - `useStats`
    - Column Hooks
      - `useRowExpandColumn`
      - `useRowSelectColumn`
      - `useRowRankColumn`
    - Numerous renderers for cells, groups, aggregations, and interactive summaries
    
  - Want your custom plugin hook listed here? [Submit a PR!](https://github.com/tannerlinsley/react-table/compare)

### Hook Usage

`useTable` is the **primary** hook used to build a React Table. It serves as the starting point for **every option and every plugin hook** that React Table supports. The options passed into `useTable` are supplied to every plugin hook after it in the order they are supplied, eventually resulting in a final `instance` object that you can use to build your table UI and interact with the table's state.

```js
const instance = useTable(
  {
    data: [...],
    columns: [...],
  },
  useGroupBy,
  useFilters,
  useSortBy,
  useExpanded,
  usePagination
)
```

### The stages of React Table and plugins

1. `useTable` is called. A table instance is created.
1. The `instance.state` is resolved from either a custom user state or an automatically generated one.
1. A collection of plugin points is created at `instance.hooks`.
1. Each plugin is given the opportunity to add hooks to `instance.hook`.
1. As the `useTable` logic proceeds to run, each plugin hook type is used at a specific point in time with each individual hook function being executed the order it was registered.
1. The final instance object is returned from `useTable`, which the developer then uses to construct their table.

This multi-stage process is the secret sauce that allows React Table plugin hooks to work together and compose nicely, while not stepping on each others toes.

To dive deeper into plugins, see Plugins and the Plugin Guide

### Plugin Hook Order & Consistency

The order and usage of plugin hooks must follow The Laws of Hooks, just like any other custom hook. They must always be unconditionally called in the same order.

> **NOTE: In the event that you want to programmatically enable or disable plugin hooks, most of them provide options to disable their functionality, eg. `options.disableSortBy`**

### Option Memoization

React Table relies on memoization to determine when state and side effects should update or be calculated. This means that every option you pass to `useTable` should be memoized either via [`React.useMemo`](https://reactjs.org/docs/hooks-reference.html#usememo) (for objects) or [`React.useCallback`](https://reactjs.org/docs/hooks-reference.html#usecallback) (for functions).
