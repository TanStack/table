---
title: Vanilla TS/JS
---

The `@tanstack/table-core` library contains the core logic for TanStack Table. If you are using a non-standard framework or don't have access to a framework, you can use the core library directly via TypeScript or JavaScript.

## `createTable`

Takes an `options` object and returns a table.

### `options`

An object that contains all core logic for the table configuration

We will find out what inside the `options` in `api/core/table` page

```tsx
import { createTable } from '@tanstack/table-core'

const table = createTable(options)
```
