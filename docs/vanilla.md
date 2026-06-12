---
title: Vanilla TS/JS
---

The `@tanstack/table-core` library contains the core logic for TanStack Table. If you are using a non-standard framework or don't have access to a framework, you can use the core library directly via TypeScript or JavaScript.

## `constructTable`

Use the `constructTable` function to create a table instance from the core library. Since there is no framework adapter to wire up reactivity for you, provide the core store reactivity bindings in your `features`:

```ts
import { constructTable, tableFeatures } from '@tanstack/table-core'
import { storeReactivityBindings } from '@tanstack/table-core/store-reactivity-bindings'

const features = tableFeatures({
  coreReactivityFeature: storeReactivityBindings(),
})

const table = constructTable({
  features,
  columns,
  data,
})

// re-render your UI whenever the table state changes
table.store.subscribe(() => renderTable())
```

See the [Basic](./framework/vanilla/examples/basic), [Sorting](./framework/vanilla/examples/sorting), and [Pagination](./framework/vanilla/examples/pagination) vanilla examples for complete, runnable setups.
