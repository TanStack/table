---
title: Row Models
---

## Row Models Guide

If you take a look at the most basic example of TanStack Table, you'll see a code snippet like this:

```ts
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'

function Component() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(), //row model
  })
}
```

What is this `getCoreRowModel` function? And why do you have to import it from TanStack Table only to just pass it back to itself?

Well the answer is that TanStack Table is a modular library. Not all code for every single feature is included in the createTable functions/hooks by default. You only need to import and include the code that you will need to correctly generate rows based on the features you want to use.

### Import Row Models

You should only import the row models that you need. Here are all of the row models that are available:

```ts
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
}
//...
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  getFacetedMinMaxValues: getFacetedMinMaxValues(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
  getFilteredRowModel: getFilteredRowModel(),
  getGroupedRowModel: getGroupedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
```

### Customize/Fork Row Models

You don't have to use the exact row models that are provided by TanStack Table. If you need some advanced customization for certain row models, feel free to copy the [source code](https://github.com/TanStack/table/tree/main/packages/table-core/src/utils) for the row model you want to customize and modify it to your needs.