---
title: Solid Table
---

The `@tanstack/solid-table` adapter is a wrapper around the core table logic. Most of it's job is related to managing state the "solid" way, providing types and the rendering implementation of cell/header/footer templates.

## `createTableInstance`

Takes a `table` and `options` object and returns a table instance.

```tsx
import { createTable, createTableInstance } from '@tanstack/solid-table'

const table = createTable()

function App() {
  const instance = createTableInstance(table, options)

  // ...render your table
}
```
