# `useGridLayout`

- Plugin Hook
- Optional

`useGridLayout` is a plugin hook that adds support for headers and cells to be rendered as `div`s (or other non-table elements) with the immediate parent (table) controlling the layout using CSS Grid. This hook becomes useful when implementing both virtualized and resizable tables that must also be able to stretch to fill all available space. Uses a minimal amount of html to give greater control of styling. Works with `useResizeColumns`.

### Table Properties

- `getTableProps`
  - **Usage Required**
  - This core prop getter is required to get the correct stying for the layout