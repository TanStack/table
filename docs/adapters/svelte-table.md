---
title: Svelte Table
---

The `@tanstack/svelte-table` adapter is a wrapper around the core table logic. Most of it's job is related to managing state the "svelte" way, providing types and the rendering implementation of cell/header/footer templates.

## `createTableInstance`

Takes a `table` and `options` object and returns a table instance.

```tsx
import { createTable, createTableInstance } from '@tanstack/svelte-table'

const table = createTable()

function App() {
  const instance = createTableInstance(table, options)

  // ...render your table
}
```
