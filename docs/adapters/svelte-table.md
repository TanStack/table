---
title: Svelte Table
---

The `@tanstack/svelte-table` adapter is a wrapper around the core table logic. Most of it's job is related to managing state the "svelte" way, providing types and the rendering implementation of cell/header/footer templates.

## `createSvelteTable`

Takes an `options` object and returns a table.

```tsx
import { createSvelteTable } from '@tanstack/svelte-table'

function App() {
  const table = createSvelteTable(options)

  // ...render your table
}
```
