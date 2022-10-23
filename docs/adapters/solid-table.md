---
title: Solid Table
---

The `@tanstack/solid-table` adapter is a wrapper around the core table logic. Most of it's job is related to managing state the "solid" way, providing types and the rendering implementation of cell/header/footer templates.

## `createSolidTable`

Takes an `options` object and returns a table.

### `options`

An object that contains all props for the table configuration

We will find out what inside the `options` in `api/core/table` page

```tsx
import { createSolidTable } from '@tanstack/solid-table'

function App() {
  const table = createSolidTable(options)

  // ...render your table
}
```
