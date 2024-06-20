---
title: React Table
---

The `@tanstack/react-table` adapter is a wrapper around the core table logic. Most of its job is related to managing state the "react" way, providing types and the rendering implementation of cell/header/footer templates.

## `useTable`

Takes an `options` object and returns a table.

```tsx
import { useTable } from '@tanstack/react-table'

function App() {
  const table = useTable(options)

  // ...render your table
}
```
