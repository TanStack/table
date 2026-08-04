---
title: FlexRender (Vue) Guide
---

Column definitions can contain strings, VNodes, Vue components, or renderer functions for `header`, `cell`, `footer`, and `aggregatedCell`. Use the adapter's rendering utilities so each form is mounted correctly and receives its table context.

## `FlexRender` vs `flexRender`

`FlexRender` is the recommended Vue component. Its shorthand props accept exactly one `cell`, `header`, or `footer` object:

```vue
<script setup lang="ts">
import { FlexRender } from '@tanstack/vue-table'
</script>

<template>
  <th v-for="header in headerGroup.headers" :key="header.id">
    <FlexRender v-if="!header.isPlaceholder" :header="header" />
  </th>

  <td v-for="cell in row.getVisibleCells()" :key="cell.id">
    <FlexRender :cell="cell" />
  </td>
</template>
```

For cells, the component selects `aggregatedCell` for aggregated rows, falls back to `cell`, and renders nothing for grouping placeholders. Use `:footer="header"` for a header object from a footer group.

Tables created by `createTableHook` also expose an app-aware component as `table.FlexRender`. Because it is stored as a value, render it with Vue's dynamic component syntax:

```vue
<component :is="table.FlexRender" :cell="cell" />
```

`flexRender` is the lower-level function for a renderable value and its props:

```ts
import { flexRender } from '@tanstack/vue-table'

flexRender(cell.column.columnDef.cell, cell.getContext())
```

It passes primitive values through, preserves returned VNodes, and creates VNodes for Vue component objects. It does not choose grouped-cell renderers or suppress grouping placeholders.

The component still supports the older low-level `render`/`props` pair:

```vue
<FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
```

Prefer the `cell`, `header`, and `footer` shorthand for new code. Placeholder headers remain the caller's layout decision, so check `header.isPlaceholder` unless a spanning-header layout intentionally renders one.
