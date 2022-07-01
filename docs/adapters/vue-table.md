---
title: Vue Table
---

The `@tanstack/vue-table` adapter is a wrapper around the core table logic. Most of it's job is related to managing state the "vue" way, providing types and the rendering implementation of cell/header/footer templates.

## `useVueTable`

Takes a `table` and `options` object and returns a table.

```tsx
import { useVueTable } from '@tanstack/vue-table'

function App() {
  const table = useVueTable(options)

  // ...render your table
}
```
