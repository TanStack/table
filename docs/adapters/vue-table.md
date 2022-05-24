---
title: Vue Table
---

The `@tanstack/vue-table` adapter is a wrapper around the core table logic. Most of it's job is related to managing state the "vue" way, providing types and the rendering implementation of cell/header/footer templates.

## `useTableInstance`

Takes a `table` and `options` object and returns a table instance.

```tsx
import { createTable, useTableInstance } from '@tanstack/vue-table'

const table = createTable()

function App() {
  const instance = useTableInstance(table, options)

  // ...render your table
}
```
