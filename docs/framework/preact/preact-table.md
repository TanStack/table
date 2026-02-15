---
title: Preact Table
---

The `@tanstack/preact-table` adapter is a wrapper around the core table logic. Most of its job is related to managing state the "preact" way, providing types and the rendering implementation of cell/header/footer templates.

## `usePreactTable`

Takes an `options` object and returns a table.

```tsx
import { usePreactTable } from '@tanstack/preact-table'

function App() {
  const table = usePreactTable(options)

  // ...render your table
}
```
