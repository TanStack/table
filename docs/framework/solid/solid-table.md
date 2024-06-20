---
title: Solid Table
---

The `@tanstack/solid-table` adapter is a wrapper around the core table logic. Most of it's job is related to managing state the "solid" way, providing types and the rendering implementation of cell/header/footer templates.

## `createTable`

Takes an `options` object and returns a table.

```tsx
import { createTable } from '@tanstack/solid-table'

function App() {
  const table = createTable(options)

  // ...render your table
}
```
